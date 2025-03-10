/**
 * OPUS Converter - Frontend JavaScript
 * 
 * Este arquivo contém todas as funcionalidades do frontend para o OPUS Converter,
 * incluindo manipulação de arquivos, envio de formulários, exibição de resultados
 * e interações com o usuário.
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
    
    // Arquivos convertidos para limpeza posterior
    let convertedFiles = [];
    
    /**
     * Verifica se o FFmpeg está instalado
     */
    async function checkFFmpeg() {
        try {
            const response = await fetch('/check-ffmpeg');
            const data = await response.json();
            return data.installed;
        } catch (error) {
            console.error('Erro ao verificar FFmpeg:', error);
            return false;
        }
    }
    
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
     * Envia os arquivos para conversão
     */
    async function convertFiles(event) {
        event.preventDefault();
        
        // Verificar se o FFmpeg está instalado
        const ffmpegInstalled = await checkFFmpeg();
        if (!ffmpegInstalled) {
            showError('O FFmpeg não está instalado ou não está no PATH do sistema. Por favor, instale o FFmpeg para usar este conversor.');
            return;
        }
        
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
        
        // Preparar os dados para envio
        const formData = new FormData();
        
        for (const file of validFiles) {
            formData.append('files[]', file);
        }
        
        formData.append('format', selectedFormat);
        
        // Mostrar modal de carregamento
        loadingModal.show();
        
        try {
            // Enviar arquivos para o servidor
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao converter arquivos');
            }
            
            const data = await response.json();
            
            // Esconder modal de carregamento
            loadingModal.hide();
            
            // Exibir resultados
            displayResults(data.results, selectedFormat);
            
        } catch (error) {
            loadingModal.hide();
            showError(error.message || 'Ocorreu um erro durante a conversão. Por favor, tente novamente.');
        }
    }
    
    /**
     * Exibe os resultados da conversão
     */
    function displayResults(results, format) {
        conversionResults.innerHTML = '';
        convertedFiles = [];
        
        if (results.length === 0) {
            conversionResults.innerHTML = '<div class="alert alert-info">Nenhum arquivo foi convertido.</div>';
            resultsCard.classList.remove('d-none');
            return;
        }
        
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            if (result.success) {
                // Adicionar à lista de arquivos convertidos para limpeza posterior
                convertedFiles.push(result.unique_name);
                
                resultItem.innerHTML = `
                    <div>
                        <div class="d-flex align-items-center">
                            <i class="bi bi-check-circle-fill result-success me-2"></i>
                            <span class="fw-bold">${result.original_name}</span>
                        </div>
                        <div class="text-muted small">Convertido para ${format.toUpperCase()}</div>
                    </div>
                    <a href="/download/${result.unique_name}" class="btn btn-sm btn-outline-primary download-btn">
                        <i class="bi bi-download"></i> Baixar
                    </a>
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
            
            // Limpar arquivos convertidos no servidor
            cleanupFiles();
        });
    }
    
    /**
     * Limpa os arquivos convertidos no servidor
     */
    async function cleanupFiles() {
        if (convertedFiles.length === 0) return;
        
        try {
            await fetch('/cleanup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filenames: convertedFiles
                })
            });
            
            // Limpar lista de arquivos convertidos
            convertedFiles = [];
        } catch (error) {
            console.error('Erro ao limpar arquivos:', error);
        }
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
    uploadForm.addEventListener('submit', convertFiles);
    
    // Limpar arquivos ao fechar a página
    window.addEventListener('beforeunload', cleanupFiles);
}); 