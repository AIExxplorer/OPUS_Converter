/**
 * OPUS Converter - Frontend JavaScript (Static Demo Version)
 * 
 * Esta é uma versão simplificada do JavaScript para a demonstração estática do OPUS Converter.
 * Não realiza conversões reais, apenas simula a interface do usuário.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do tema
    initTheme();
    
    // Manipulação de arquivos
    const fileInput = document.getElementById('fileInput');
    const clearButton = document.getElementById('clearButton');
    const fileList = document.getElementById('fileList');
    const selectedFiles = document.getElementById('selectedFiles');
    const uploadForm = document.getElementById('uploadForm');
    const resultsCard = document.getElementById('resultsCard');
    const conversionResults = document.getElementById('conversionResults');
    const themeToggle = document.getElementById('themeToggle');
    
    // Adicionar evento para o botão de alternância de tema
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            toggleTheme();
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            updateFileList();
        });
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            clearFileInput();
        });
    }
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(event) {
            simulateConversion(event);
        });
    }
    
    // Função para inicializar o tema com base na preferência salva
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Atualizar o ícone do botão de tema
        updateThemeIcon(savedTheme);
    }
    
    // Função para alternar entre temas claro e escuro
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Atualizar o ícone do botão de tema
        updateThemeIcon(newTheme);
    }
    
    // Função para atualizar o ícone do botão de tema
    function updateThemeIcon(theme) {
        // Esta função é apenas visual, os ícones são controlados via CSS
        console.log('Tema atual:', theme);
    }
    
    function updateFileList() {
        if (fileInput.files.length > 0) {
            fileList.classList.remove('d-none');
            selectedFiles.innerHTML = '';
            
            // Limitar a 10 arquivos
            const maxFiles = Math.min(fileInput.files.length, 10);
            
            for (let i = 0; i < maxFiles; i++) {
                const file = fileInput.files[i];
                const fileSize = formatFileSize(file.size);
                
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                
                const fileNameSpan = document.createElement('span');
                fileNameSpan.className = 'file-name';
                fileNameSpan.textContent = file.name;
                
                const fileSizeSpan = document.createElement('span');
                fileSizeSpan.className = 'file-size';
                fileSizeSpan.textContent = fileSize;
                
                listItem.appendChild(fileNameSpan);
                listItem.appendChild(fileSizeSpan);
                selectedFiles.appendChild(listItem);
            }
            
            if (fileInput.files.length > 10) {
                const warningItem = document.createElement('li');
                warningItem.className = 'list-group-item list-group-item-warning';
                warningItem.textContent = `Apenas os primeiros 10 arquivos serão processados. ${fileInput.files.length - 10} arquivo(s) ignorado(s).`;
                selectedFiles.appendChild(warningItem);
            }
        } else {
            fileList.classList.add('d-none');
        }
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    function clearFileInput() {
        fileInput.value = '';
        fileList.classList.add('d-none');
        selectedFiles.innerHTML = '';
    }
    
    function simulateConversion(event) {
        event.preventDefault();
        
        if (fileInput.files.length === 0) {
            showError('Por favor, selecione pelo menos um arquivo para converter.');
            return;
        }
        
        // Obter o formato selecionado
        const formatRadios = document.getElementsByName('format');
        let selectedFormat = 'mp3';
        
        for (const radio of formatRadios) {
            if (radio.checked) {
                selectedFormat = radio.value;
                break;
            }
        }
        
        // Mostrar modal de carregamento
        const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        loadingModal.show();
        
        // Simular tempo de conversão (2-4 segundos por arquivo)
        const conversionTime = Math.max(2000, Math.min(fileInput.files.length * 1000, 4000));
        
        setTimeout(function() {
            loadingModal.hide();
            
            // Simular resultados da conversão
            const results = [];
            
            for (let i = 0; i < Math.min(fileInput.files.length, 10); i++) {
                const file = fileInput.files[i];
                const success = Math.random() > 0.1; // 90% de chance de sucesso
                
                results.push({
                    fileName: file.name,
                    success: success,
                    message: success ? 'Convertido com sucesso' : 'Erro na conversão',
                    outputFileName: success ? file.name.replace('.opus', '.' + selectedFormat) : null
                });
            }
            
            displayResults(results, selectedFormat);
        }, conversionTime);
    }
    
    function displayResults(results, format) {
        resultsCard.classList.remove('d-none');
        conversionResults.innerHTML = '';
        
        const successCount = results.filter(r => r.success).length;
        const failCount = results.length - successCount;
        
        // Adicionar resumo
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'alert ' + (failCount === 0 ? 'alert-success' : 'alert-warning');
        
        let summaryText = `<strong>${successCount} de ${results.length} arquivo(s)</strong> convertido(s) com sucesso para ${format.toUpperCase()}.`;
        
        if (failCount > 0) {
            summaryText += ` ${failCount} arquivo(s) não pôde(puderam) ser convertido(s).`;
        }
        
        summaryDiv.innerHTML = summaryText;
        conversionResults.appendChild(summaryDiv);
        
        // Adicionar detalhes de cada arquivo
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            const fileInfo = document.createElement('div');
            fileInfo.className = 'd-flex flex-column';
            
            const fileName = document.createElement('div');
            fileName.className = 'fw-bold';
            fileName.textContent = result.fileName;
            
            const status = document.createElement('div');
            status.className = result.success ? 'result-success' : 'result-error';
            status.innerHTML = `<i class="bi ${result.success ? 'bi-check-circle' : 'bi-x-circle'}"></i> ${result.message}`;
            
            fileInfo.appendChild(fileName);
            fileInfo.appendChild(status);
            
            resultItem.appendChild(fileInfo);
            
            if (result.success) {
                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'btn btn-sm btn-outline-primary download-btn';
                downloadBtn.innerHTML = `<i class="bi bi-download"></i> Baixar ${format.toUpperCase()}`;
                downloadBtn.addEventListener('click', function() {
                    // Simular download (apenas alerta)
                    alert(`Em uma versão real, o arquivo ${result.outputFileName} seria baixado agora.`);
                });
                
                resultItem.appendChild(downloadBtn);
            }
            
            conversionResults.appendChild(resultItem);
        });
        
        // Rolar para os resultados
        resultsCard.scrollIntoView({ behavior: 'smooth' });
    }
    
    function showError(message) {
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        document.getElementById('errorModalBody').textContent = message;
        errorModal.show();
    }
}); 