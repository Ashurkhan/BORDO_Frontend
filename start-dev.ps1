#!/usr/bin/env pwsh

# Bordo - Скрипт запуска Frontend и Backend
# Использование: ./start-dev.ps1

Write-Host "🐄 Запуск Bordo Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Проверка Node.js
Write-Host "📋 Проверка зависимостей..." -ForegroundColor Yellow
$node = node --version
Write-Host "✅ Node.js: $node"

# Проверка npm
$npm = npm --version
Write-Host "✅ npm: $npm"

Write-Host ""
Write-Host "⚠️  ВАЖНО: Spring Backend должен быть запущен отдельно!" -ForegroundColor Yellow
Write-Host "Команда для Backend (в другом терминале):" -ForegroundColor Yellow
Write-Host "  cd path/to/spring/project" -ForegroundColor Cyan
Write-Host "  mvn spring-boot:run" -ForegroundColor Cyan
Write-Host ""

# Переход в правильную папку
$scriptDir = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

# Проверка package.json
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Ошибка: package.json не найден!" -ForegroundColor Red
    Write-Host "Убедитесь что скрипт запущен из папки college/" -ForegroundColor Red
    exit 1
}

# Установка зависимостей если их нет
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Установка npm зависимостей..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Ошибка установки зависимостей!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Все готово!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Запуск Frontend сервера..." -ForegroundColor Cyan
Write-Host ""

# Запуск dev сервера
npm run dev
