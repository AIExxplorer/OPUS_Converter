# Script para adicionar FFmpeg ao PATH do sistema
# Deve ser executado como Administrador

# Função para verificar se o script está sendo executado como administrador
function Test-Admin {
    $currentUser = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    $isAdmin = $currentUser.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    return $isAdmin
}

# Verificar se está sendo executado como administrador
if (-not (Test-Admin)) {
    Write-Host "Este script precisa ser executado como Administrador." -ForegroundColor Red
    Write-Host "Por favor, feche o PowerShell e execute novamente como Administrador." -ForegroundColor Red
    Write-Host "Pressione qualquer tecla para sair..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

# Função para verificar se o FFmpeg já está no PATH
function Test-FFmpegInPath {
    try {
        $ffmpegPath = Get-Command ffmpeg -ErrorAction Stop
        return $true, $ffmpegPath.Source
    }
    catch {
        return $false, $null
    }
}

# Função para procurar o FFmpeg no sistema
function Find-FFmpeg {
    $commonPaths = @(
        "C:\ffmpeg\bin",
        "C:\Program Files\ffmpeg\bin",
        "C:\Program Files (x86)\ffmpeg\bin",
        "$env:LOCALAPPDATA\Programs\ffmpeg\bin",
        "$env:ProgramData\chocolatey\bin"
    )

    foreach ($path in $commonPaths) {
        if (Test-Path "$path\ffmpeg.exe") {
            return $true, $path
        }
    }

    return $false, $null
}

# Função para adicionar um caminho ao PATH do sistema
function Add-ToPath {
    param (
        [string]$NewPath
    )

    # Obter o PATH atual
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    
    # Verificar se o caminho já está no PATH
    if ($currentPath -split ";" -contains $NewPath) {
        Write-Host "O caminho '$NewPath' já está no PATH do sistema." -ForegroundColor Yellow
        return $false
    }
    
    # Adicionar o novo caminho ao PATH
    $newPathValue = $currentPath + ";" + $NewPath
    [Environment]::SetEnvironmentVariable("Path", $newPathValue, "Machine")
    
    Write-Host "O caminho '$NewPath' foi adicionado ao PATH do sistema com sucesso." -ForegroundColor Green
    return $true
}

# Função principal
function Main {
    Clear-Host
    Write-Host "===== Ferramenta para adicionar FFmpeg ao PATH do sistema =====" -ForegroundColor Cyan
    Write-Host ""

    # Verificar se o FFmpeg já está no PATH
    $inPath, $ffmpegPath = Test-FFmpegInPath
    if ($inPath) {
        Write-Host "FFmpeg já está no PATH do sistema!" -ForegroundColor Green
        Write-Host "Localização: $ffmpegPath" -ForegroundColor Green
        Write-Host ""
        Write-Host "Não é necessário fazer alterações." -ForegroundColor Green
        return
    }

    Write-Host "FFmpeg não foi encontrado no PATH do sistema." -ForegroundColor Yellow
    Write-Host "Procurando por instalações existentes do FFmpeg..." -ForegroundColor Yellow
    
    # Procurar o FFmpeg em locais comuns
    $found, $ffmpegPath = Find-FFmpeg
    
    if ($found) {
        Write-Host "FFmpeg encontrado em: $ffmpegPath" -ForegroundColor Green
        $addToPath = Read-Host "Deseja adicionar este caminho ao PATH do sistema? (S/N)"
        
        if ($addToPath -eq "S" -or $addToPath -eq "s") {
            $added = Add-ToPath -NewPath $ffmpegPath
            if ($added) {
                Write-Host "Para que as alterações tenham efeito, você precisa reiniciar o PowerShell ou o computador." -ForegroundColor Yellow
            }
        }
        else {
            Write-Host "Operação cancelada pelo usuário." -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "FFmpeg não foi encontrado automaticamente." -ForegroundColor Red
        Write-Host "Você pode especificar manualmente o caminho para a pasta bin do FFmpeg." -ForegroundColor Yellow
        
        $manualPath = Read-Host "Digite o caminho completo para a pasta bin do FFmpeg (ou pressione Enter para cancelar)"
        
        if (-not [string]::IsNullOrWhiteSpace($manualPath)) {
            if (Test-Path "$manualPath\ffmpeg.exe") {
                $added = Add-ToPath -NewPath $manualPath
                if ($added) {
                    Write-Host "Para que as alterações tenham efeito, você precisa reiniciar o PowerShell ou o computador." -ForegroundColor Yellow
                }
            }
            else {
                Write-Host "O arquivo ffmpeg.exe não foi encontrado no caminho especificado." -ForegroundColor Red
                Write-Host "Verifique se o caminho está correto e tente novamente." -ForegroundColor Red
            }
        }
        else {
            Write-Host "Operação cancelada pelo usuário." -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Para instalar o FFmpeg, siga estas instruções:" -ForegroundColor Cyan
            Write-Host "1. Baixe o FFmpeg do site oficial: https://ffmpeg.org/download.html" -ForegroundColor White
            Write-Host "2. Extraia o arquivo baixado para uma pasta (ex: C:\ffmpeg)" -ForegroundColor White
            Write-Host "3. Execute este script novamente e especifique o caminho para a pasta bin" -ForegroundColor White
            Write-Host "   (geralmente é a pasta 'bin' dentro da pasta onde você extraiu o FFmpeg)" -ForegroundColor White
        }
    }
}

# Executar a função principal
Main

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 