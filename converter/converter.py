import os
import subprocess
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def check_ffmpeg():
    """
    Verifica se o FFMPEG está instalado no sistema.
    
    Returns:
        bool: True se o FFMPEG estiver disponível, False caso contrário.
    """
    try:
        subprocess.run(['ffmpeg', '-version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return True
    except (subprocess.SubprocessError, FileNotFoundError):
        logger.error("FFMPEG não está instalado ou não está no PATH do sistema.")
        return False

def convert_audio(input_file, output_file, output_format):
    """
    Converte um arquivo de áudio OPUS para o formato especificado usando FFMPEG.
    
    Args:
        input_file (str): Caminho para o arquivo de entrada (OPUS).
        output_file (str): Caminho para o arquivo de saída.
        output_format (str): Formato de saída ('mp3', 'wav', 'flac', ou 'aac').
        
    Raises:
        ValueError: Se o FFMPEG não estiver instalado ou se ocorrer um erro durante a conversão.
        FileNotFoundError: Se o arquivo de entrada não existir.
    """
    if not check_ffmpeg():
        raise ValueError("FFMPEG não está instalado. Por favor, instale o FFMPEG para usar este conversor.")
    
    if not os.path.exists(input_file):
        raise FileNotFoundError(f"Arquivo de entrada não encontrado: {input_file}")
    
    # Definir parâmetros de codificação com base no formato de saída
    codec_params = {
        'mp3': ['-codec:a', 'libmp3lame', '-qscale:a', '2'],  # Qualidade alta MP3
        'wav': ['-codec:a', 'pcm_s16le'],  # WAV padrão 16-bit
        'flac': ['-codec:a', 'flac'],  # FLAC padrão
        'aac': ['-codec:a', 'aac', '-b:a', '192k']  # AAC com bitrate de 192k
    }
    
    if output_format not in codec_params:
        raise ValueError(f"Formato de saída não suportado: {output_format}")
    
    # Construir comando FFMPEG
    cmd = ['ffmpeg', '-i', input_file, '-y']  # -y para sobrescrever arquivos existentes
    cmd.extend(codec_params[output_format])
    cmd.append(output_file)
    
    logger.info(f"Convertendo {input_file} para {output_format}")
    
    try:
        # Executar comando FFMPEG
        process = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True,
            text=True
        )
        
        # Verificar se o arquivo de saída foi criado
        if not os.path.exists(output_file):
            raise ValueError("A conversão falhou: o arquivo de saída não foi criado.")
        
        logger.info(f"Conversão concluída com sucesso: {output_file}")
        return True
        
    except subprocess.CalledProcessError as e:
        logger.error(f"Erro ao converter arquivo: {e.stderr}")
        raise ValueError(f"Erro ao converter arquivo: {e.stderr}")
    except Exception as e:
        logger.error(f"Erro inesperado durante a conversão: {str(e)}")
        raise ValueError(f"Erro inesperado durante a conversão: {str(e)}")

def get_audio_info(file_path):
    """
    Obtém informações sobre um arquivo de áudio usando FFMPEG.
    
    Args:
        file_path (str): Caminho para o arquivo de áudio.
        
    Returns:
        dict: Dicionário contendo informações sobre o arquivo de áudio.
    """
    if not check_ffmpeg():
        raise ValueError("FFMPEG não está instalado. Por favor, instale o FFMPEG para usar este conversor.")
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Arquivo não encontrado: {file_path}")
    
    cmd = [
        'ffprobe', 
        '-v', 'quiet', 
        '-print_format', 'json', 
        '-show_format', 
        '-show_streams', 
        file_path
    ]
    
    try:
        process = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True,
            text=True
        )
        
        import json
        info = json.loads(process.stdout)
        return info
        
    except subprocess.CalledProcessError as e:
        logger.error(f"Erro ao obter informações do arquivo: {e.stderr}")
        raise ValueError(f"Erro ao obter informações do arquivo: {e.stderr}")
    except Exception as e:
        logger.error(f"Erro inesperado: {str(e)}")
        raise ValueError(f"Erro inesperado: {str(e)}") 