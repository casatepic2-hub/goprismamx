@echo off
echo ================================================
echo    Casa Tepic - Sitio Web de Venta
echo    Puerto: 4299
echo ================================================
echo.
echo Instalando dependencias...
call npm install
echo.
echo Iniciando servidor de desarrollo...
echo Abre http://localhost:4299 en tu navegador
echo.
call npm run dev
pause
