@echo off
title Adicionar FFmpeg ao PATH do Sistema
color 0A

:: Verificar se está sendo executado como administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Este script precisa ser executado como Administrador.
    echo Por favor, clique com o botão direito no arquivo e selecione "Executar como administrador".
    echo.
    echo Pressione qualquer tecla para sair...
    pause >nul
    exit /b 1
)

:: Verificar se o FFmpeg já está no PATH
where ffmpeg >nul 2>&1
if %errorLevel% equ 0 (
    echo FFmpeg ja esta no PATH do sistema!
    for /f "tokens=*" %%i in ('where ffmpeg') do (
        echo Localizacao: %%i
    )
    echo.
    echo Nao e necessario fazer alteracoes.
    goto :end
)

echo FFmpeg nao foi encontrado no PATH do sistema.
echo Procurando por instalacoes existentes do FFmpeg...
echo.

:: Procurar o FFmpeg em locais comuns
set "FOUND=0"
set "FFMPEG_PATH="

:: Lista de caminhos comuns para verificar
set "COMMON_PATHS=C:\ffmpeg\bin C:\Program Files\ffmpeg\bin C:\Program Files (x86)\ffmpeg\bin %LOCALAPPDATA%\Programs\ffmpeg\bin %ProgramData%\chocolatey\bin"

for %%p in (%COMMON_PATHS%) do (
    if exist "%%p\ffmpeg.exe" (
        set "FOUND=1"
        set "FFMPEG_PATH=%%p"
        goto :found
    )
)

:found
if "%FOUND%"=="1" (
    echo FFmpeg encontrado em: %FFMPEG_PATH%
    set /p CONFIRM="Deseja adicionar este caminho ao PATH do sistema? (S/N): "
    if /i "%CONFIRM%"=="S" (
        goto :addToPath
    ) else (
        echo Operacao cancelada pelo usuario.
        goto :end
    )
) else (
    echo FFmpeg nao foi encontrado automaticamente.
    echo Voce pode especificar manualmente o caminho para a pasta bin do FFmpeg.
    echo.
    set /p MANUAL_PATH="Digite o caminho completo para a pasta bin do FFmpeg (ou pressione Enter para cancelar): "
    
    if "%MANUAL_PATH%"=="" (
        echo Operacao cancelada pelo usuario.
        echo.
        echo Para instalar o FFmpeg, siga estas instrucoes:
        echo 1. Baixe o FFmpeg do site oficial: https://ffmpeg.org/download.html
        echo 2. Extraia o arquivo baixado para uma pasta (ex: C:\ffmpeg)
        echo 3. Execute este script novamente e especifique o caminho para a pasta bin
        echo    (geralmente e a pasta 'bin' dentro da pasta onde voce extraiu o FFmpeg)
        goto :end
    )
    
    if exist "%MANUAL_PATH%\ffmpeg.exe" (
        set "FFMPEG_PATH=%MANUAL_PATH%"
        goto :addToPath
    ) else (
        echo O arquivo ffmpeg.exe nao foi encontrado no caminho especificado.
        echo Verifique se o caminho esta correto e tente novamente.
        goto :end
    )
)

:addToPath
:: Adicionar ao PATH
setx PATH "%PATH%;%FFMPEG_PATH%" /M
if %errorLevel% equ 0 (
    echo O caminho '%FFMPEG_PATH%' foi adicionado ao PATH do sistema com sucesso.
    echo Para que as alteracoes tenham efeito, voce precisa reiniciar o prompt de comando ou o computador.
) else (
    echo Ocorreu um erro ao adicionar o caminho ao PATH do sistema.
    echo Verifique se voce tem permissoes de administrador.
)

:end
echo.
echo Pressione qualquer tecla para sair...
pause >nul 