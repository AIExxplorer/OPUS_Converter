import os
import uuid
from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory, jsonify
from werkzeug.utils import secure_filename
from converter.converter import convert_audio, check_ffmpeg

# Configuração da aplicação
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'opus-converter-secret-key')
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
app.config['CONVERTED_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'converted')
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max
app.config['ALLOWED_EXTENSIONS'] = {'opus'}

# Criar diretórios se não existirem
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['CONVERTED_FOLDER'], exist_ok=True)

def allowed_file(filename):
    """Verifica se o arquivo tem uma extensão permitida."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
    """Renderiza a página inicial."""
    ffmpeg_installed = check_ffmpeg()
    return render_template('index.html', ffmpeg_installed=ffmpeg_installed)

@app.route('/about')
def about():
    """Renderiza a página Sobre."""
    return render_template('about.html')

@app.route('/check-ffmpeg')
def check_ffmpeg_route():
    """Verifica se o FFmpeg está instalado e retorna o resultado."""
    is_installed = check_ffmpeg()
    return jsonify({'installed': is_installed})

@app.route('/upload', methods=['POST'])
def upload_file():
    """Processa o upload de arquivos e inicia a conversão."""
    # Verificar se o FFmpeg está instalado
    if not check_ffmpeg():
        return jsonify({
            'error': 'FFmpeg não está instalado ou não está no PATH do sistema. Por favor, instale o FFmpeg para usar este conversor.'
        }), 500
    
    if 'files[]' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400
    
    files = request.files.getlist('files[]')
    
    if len(files) > 10:
        return jsonify({'error': 'Máximo de 10 arquivos permitidos'}), 400
    
    output_format = request.form.get('format', 'mp3')
    if output_format not in ['mp3', 'wav', 'flac', 'aac']:
        return jsonify({'error': 'Formato de saída inválido'}), 400
    
    results = []
    
    for file in files:
        if file.filename == '':
            continue
        
        if not allowed_file(file.filename):
            results.append({
                'original_name': file.filename,
                'success': False,
                'error': 'Formato não suportado. Apenas arquivos OPUS são aceitos.'
            })
            continue
        
        # Gerar nome de arquivo único para evitar colisões
        original_filename = secure_filename(file.filename)
        unique_id = str(uuid.uuid4())
        temp_filename = f"{unique_id}_{original_filename}"
        temp_filepath = os.path.join(app.config['UPLOAD_FOLDER'], temp_filename)
        
        # Salvar arquivo temporariamente
        file.save(temp_filepath)
        
        # Converter o arquivo
        try:
            output_filename = f"{original_filename.rsplit('.', 1)[0]}.{output_format}"
            unique_output_filename = f"{unique_id}_{output_filename}"
            output_filepath = os.path.join(app.config['CONVERTED_FOLDER'], unique_output_filename)
            
            convert_audio(temp_filepath, output_filepath, output_format)
            
            # Adicionar resultado
            results.append({
                'original_name': original_filename,
                'converted_name': output_filename,
                'unique_name': unique_output_filename,
                'success': True
            })
            
        except Exception as e:
            results.append({
                'original_name': original_filename,
                'success': False,
                'error': str(e)
            })
            
        # Remover arquivo temporário
        try:
            os.remove(temp_filepath)
        except:
            pass
    
    return jsonify({'results': results})

@app.route('/download/<filename>')
def download_file(filename):
    """Permite o download de um arquivo convertido."""
    return send_from_directory(app.config['CONVERTED_FOLDER'], filename, as_attachment=True)

@app.route('/cleanup', methods=['POST'])
def cleanup():
    """Remove arquivos convertidos após o download."""
    filenames = request.json.get('filenames', [])
    
    for filename in filenames:
        try:
            filepath = os.path.join(app.config['CONVERTED_FOLDER'], filename)
            if os.path.exists(filepath):
                os.remove(filepath)
        except:
            pass
    
    return jsonify({'success': True})

@app.errorhandler(413)
def request_entity_too_large(error):
    """Manipula erros de arquivo muito grande."""
    return jsonify({'error': 'Arquivo muito grande. O tamanho máximo é 100MB.'}), 413

if __name__ == '__main__':
    app.run(debug=True) 