/**
 * OPUS Converter - Frontend JavaScript (Static Demo Version)
 * 
 * Esta é uma versão simplificada do JavaScript para a demonstração estática do OPUS Converter.
 * Não realiza conversões reais, apenas simula a interface do usuário.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const clearButton = document.getElementById('clearButton');
    const fileList = document.getElementById('fileList');
    const selectedFiles = document.getElementById('selectedFiles');
    const resultsCard = document.getElementById('resultsCard');
    const conversionResults = document.getElementById('conversionResults');
    
    // Modais
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    const errorModalBody = document.getElementById('errorModalBody');
    
    /**
     * Atualiza a lista de arquivos selecionados
     */
    function updateFileList() {
        selectedFiles.innerHTML = '';
        
        if (fileInput.files.length === 0) {
            fileList.classList.add('d-none');
            return;
        }
        
        fileList.classList.remove('d-none');
        
        Array.from(fileInput.files).forEach(file => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            
            // Verificar se é um arquivo OPUS
            const isOpus = file.name.toLowerCase().endsWith('.opus');
            
            // Formatar o tamanho do arquivo
            const fileSize = formatFileSize(file.size);
            
            listItem.innerHTML = `
                <div class="file-name ${!isOpus ? 'text-danger' : ''}">
                    ${file.name} ${!isOpus ? '(Formato não suportado)' : ''}
                </div>
                <span class="file-size">${fileSize}</span>
            `;
            
            selectedFiles.appendChild(listItem);
        });
        
        // Verificar se há arquivos não suportados
        const hasInvalidFiles = Array.from(fileInput.files).some(file => !file.name.toLowerCase().endsWith('.opus'));
        
        if (hasInvalidFiles) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-warning mt-2';
            alertDiv.innerHTML = 'Alguns arquivos selecionados não são do formato OPUS e serão ignorados.';
            selectedFiles.appendChild(alertDiv);
        }
    }
    
    /**
     * Formata o tamanho do arquivo para exibição
     */
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * Limpa a lista de arquivos selecionados
     */
    function clearFileInput() {
        fileInput.value = '';
        updateFileList();
    }
    
    /**
     * Simula a conversão de arquivos (versão de demonstração)
     */
    function simulateConversion(event) {
        event.preventDefault();
        
        // Verificar se há arquivos selecionados
        if (fileInput.files.length === 0) {
            showError('Por favor, selecione pelo menos um arquivo OPUS para converter.');
            return;
        }
        
        // Verificar se há mais de 10 arquivos
        if (fileInput.files.length > 10) {
            showError('Você pode converter no máximo 10 arquivos por vez.');
            return;
        }
        
        // Verificar se todos os arquivos são OPUS
        const validFiles = Array.from(fileInput.files).filter(file => file.name.toLowerCase().endsWith('.opus'));
        
        if (validFiles.length === 0) {
            showError('Nenhum arquivo OPUS válido foi selecionado. Por favor, selecione arquivos com a extensão .opus');
            return;
        }
        
        // Obter o formato de saída selecionado
        const formatRadios = document.getElementsByName('format');
        let selectedFormat = 'mp3'; // Padrão
        
        for (const radio of formatRadios) {
            if (radio.checked) {
                selectedFormat = radio.value;
                break;
            }
        }
        
        // Mostrar modal de carregamento
        loadingModal.show();
        
        // Simular tempo de processamento
        setTimeout(() => {
            // Esconder modal de carregamento
            loadingModal.hide();
            
            // Simular resultados
            const results = validFiles.map(file => ({
                original_name: file.name,
                converted_name: file.name.replace('.opus', '.' + selectedFormat),
                unique_name: 'demo_' + file.name.replace('.opus', '.' + selectedFormat),
                success: true
            }));
            
            // Exibir resultados simulados
            displayResults(results, selectedFormat);
        }, 2000); // Simular 2 segundos de processamento
    }
    
    /**
     * Exibe os resultados da conversão
     */
    function displayResults(results, format) {
        conversionResults.innerHTML = '';
        
        if (results.length === 0) {
            conversionResults.innerHTML = '<div class="alert alert-info">Nenhum arquivo foi convertido.</div>';
            resultsCard.classList.remove('d-none');
            return;
        }
        
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            if (result.success) {
                resultItem.innerHTML = `
                    <div>
                        <div class="d-flex align-items-center">
                            <i class="bi bi-check-circle-fill result-success me-2"></i>
                            <span class="fw-bold">${result.original_name}</span>
                        </div>
                        <div class="text-muted small">Convertido para ${format.toUpperCase()} (simulação)</div>
                    </div>
                    <button class="btn btn-sm btn-outline-primary download-btn disabled">
                        <i class="bi bi-download"></i> Baixar (indisponível na demo)
                    </button>
                `;
            } else {
                resultItem.innerHTML = `
                    <div>
                        <div class="d-flex align-items-center">
                            <i class="bi bi-x-circle-fill result-error me-2"></i>
                            <span class="fw-bold">${result.original_name}</span>
                        </div>
                        <div class="text-danger small">${result.error || 'Erro na conversão'}</div>
                    </div>
                `;
            }
            
            conversionResults.appendChild(resultItem);
        });
        
        // Adicionar nota de demonstração
        const demoNote = document.createElement('div');
        demoNote.className = 'alert alert-info mt-3';
        demoNote.innerHTML = `
            <strong>Nota:</strong> Esta é uma versão de demonstração. 
            Para conversão real de arquivos, por favor 
            <a href="https://github.com/AIEXXPLERERR/opus-converter" target="_blank" class="alert-link">
                baixe o projeto completo
            </a> 
            e execute-o localmente.
        `;
        conversionResults.appendChild(demoNote);
        
        // Adicionar botão para converter mais arquivos
        const moreButton = document.createElement('div');
        moreButton.className = 'text-center mt-3';
        moreButton.innerHTML = `
            <button type="button" class="btn btn-outline-secondary" id="convertMoreBtn">
                <i class="bi bi-plus-circle"></i> Converter mais arquivos
            </button>
        `;
        conversionResults.appendChild(moreButton);
        
        // Mostrar card de resultados
        resultsCard.classList.remove('d-none');
        
        // Adicionar evento ao botão de converter mais
        document.getElementById('convertMoreBtn').addEventListener('click', function() {
            // Limpar formulário
            clearFileInput();
            
            // Esconder resultados
            resultsCard.classList.add('d-none');
        });
    }
    
    /**
     * Exibe uma mensagem de erro
     */
    function showError(message) {
        errorModalBody.textContent = message;
        errorModal.show();
    }
    
    // Event Listeners
    fileInput.addEventListener('change', updateFileList);
    clearButton.addEventListener('click', clearFileInput);
    uploadForm.addEventListener('submit', simulateConversion);
}); 