# OPUS Converter

## Sobre o Projeto

OPUS Converter é uma aplicação web que permite converter arquivos de áudio do formato OPUS para outros formatos populares, como MP3, WAV, FLAC e AAC. Esta ferramenta foi desenvolvida para facilitar a conversão de múltiplos arquivos simultaneamente, oferecendo uma interface simples e intuitiva.

## Demonstração Online

Uma versão de demonstração estática está disponível em [GitHub Pages](https://aiexxplererr.github.io/opus-converter/). Esta versão é apenas para fins de demonstração e não realiza conversões reais. Para a funcionalidade completa, siga as instruções de instalação abaixo.

## Características Principais

- Conversão de arquivos OPUS para MP3, WAV, FLAC e AAC
- Upload de até 10 arquivos OPUS simultaneamente
- Interface de usuário simples e intuitiva
- Indicador visual de conversão bem-sucedida
- Botão de download para cada arquivo convertido
- Detecção automática de FFmpeg
- Navegação entre páginas
- Componentes reutilizáveis
- Alternância entre temas claro e escuro

## Tecnologias Utilizadas

- **Backend**: Python com Flask
- **Frontend**: HTML, CSS, JavaScript
- **Conversão de Áudio**: FFMPEG
- **Estilização**: Bootstrap 5
- **Processamento Assíncrono**: Celery (opcional para grandes volumes)

### Justificativa das Escolhas Tecnológicas

- **Python/Flask**: Fácil de implementar, grande suporte para manipulação de arquivos e integração com FFMPEG.
- **FFMPEG**: Biblioteca robusta e de código aberto para processamento de áudio e vídeo, com suporte a praticamente todos os formatos.
- **Bootstrap**: Fornece componentes responsivos e modernos sem necessidade de muito CSS personalizado.
- **JavaScript Vanilla**: Para uma aplicação desta complexidade, frameworks como React seriam excessivos.

## Requisitos

- Python 3.8+
- FFMPEG instalado no sistema
- Navegador web moderno

## Instalação

1. Clone o repositório:
```
git clone https://github.com/AIEXXPLERERR/opus-converter.git
cd opus-converter
```

2. Crie um ambiente virtual e ative-o:
```
python -m venv venv
# No Windows
venv\Scripts\activate
# No Linux/Mac
source venv/bin/activate
```

3. Instale as dependências:
```
pip install -r requirements.txt
```

4. Certifique-se de que o FFMPEG está instalado no seu sistema:
   - **Windows**: Baixe do [site oficial](https://ffmpeg.org/download.html) e adicione ao PATH
   - **Linux**: `sudo apt-get install ffmpeg`
   - **Mac**: `brew install ffmpeg`

## Como Usar

1. Inicie a aplicação:
```
python app.py
```

2. Abra seu navegador e acesse `http://localhost:5000`

3. Selecione os arquivos OPUS que deseja converter (até 10 arquivos)

4. Escolha o formato de saída desejado (MP3, WAV, FLAC ou AAC)

5. Clique em "Converter" e aguarde o processo ser concluído

6. Faça o download dos arquivos convertidos

## Estrutura do Projeto

```
opus-converter/
│
├── app.py                  # Aplicação Flask principal
├── converter/              # Módulo de conversão
│   ├── __init__.py
│   └── converter.py        # Lógica de conversão usando FFMPEG
│
├── static/                 # Arquivos estáticos
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── img/
│   │   └── favicon.ico     # Favicon da aplicação
│   ├── samples/            # Arquivos de exemplo
│   │   └── README.txt      # Instruções para adicionar amostras
│   └── LICENSE             # Cópia da licença para acesso web
│
├── templates/              # Templates HTML
│   ├── components/         # Componentes reutilizáveis
│   │   └── footer.html     # Componente de rodapé
│   ├── index.html          # Página principal
│   └── about.html          # Página Sobre
│
├── uploads/                # Diretório para arquivos enviados (temporário)
├── converted/              # Diretório para arquivos convertidos
│
├── requirements.txt        # Dependências do projeto
├── .gitignore              # Configuração do Git
├── LICENSE                 # Licença do projeto
└── README.md               # Este arquivo
```

## Funcionalidades Adicionais

### Detecção de FFmpeg

A aplicação verifica automaticamente se o FFmpeg está instalado no sistema e exibe um aviso caso não esteja. Isso ajuda os usuários a identificar problemas de configuração antes de tentar converter arquivos.

### Navegação

A aplicação possui uma barra de navegação que permite aos usuários acessar facilmente as diferentes páginas:
- **Início**: Página principal com o conversor
- **Sobre**: Informações sobre o projeto e seu desenvolvedor

### Componentes Reutilizáveis

O projeto utiliza componentes reutilizáveis para manter a consistência visual e facilitar a manutenção:
- **Footer**: Rodapé com informações de copyright, links úteis e redes sociais

## Limitações Conhecidas

- O tamanho máximo de upload é limitado a 100MB por arquivo
- Apenas arquivos OPUS são aceitos como entrada
- A aplicação não é otimizada para conversão de arquivos muito grandes
- É necessário ter o FFmpeg instalado no sistema para realizar as conversões

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Autor

- **Wagner Rafael** - Fundador da AIExxplorer™
- [GitHub](https://github.com/AIExxplorer)
- [LinkedIn](https://linkedin.com/in/AIExxplorer)

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes. 
