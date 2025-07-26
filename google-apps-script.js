/**
 * Google Apps Script para integração com Google Sheets
 * Este código deve ser colado no Google Apps Script (script.google.com)
 * 
 * Configuração:
 * 1. Acesse script.google.com
 * 2. Crie um novo projeto
 * 3. Cole este código
 * 4. Configure as permissões
 * 5. Implante como aplicação web
 * 6. Copie a URL gerada e atualize no script.js
 */

// ID da planilha do Google Sheets
const SPREADSHEET_ID = '1ntTy0PuYQEGGh095nqg_U9OLyKTZ3T8Sz_kHpLd07U0';

// Nome da aba onde os dados serão inseridos
const SHEET_NAME = 'Confirmações';

/**
 * Função principal que recebe as requisições HTTP
 */
function doPost(e) {
  try {
    // Parse dos dados recebidos
    const data = JSON.parse(e.postData.contents);
    
    // Adiciona os dados na planilha
    const result = addToSheet(data);
    
    // Retorna resposta de sucesso
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Dados adicionados com sucesso',
        data: result
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Erro ao processar dados',
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

/**
 * Função para lidar com requisições OPTIONS (CORS)
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

/**
 * Adiciona dados na planilha do Google Sheets
 */
function addToSheet(data) {
  try {
    // Abre a planilha
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Obtém ou cria a aba
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // Adiciona cabeçalhos se a aba foi criada agora
      const headers = ['Timestamp', 'Nome', 'Evento', 'IP', 'User Agent'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Formata os cabeçalhos
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#B85A6E');
      headerRange.setFontColor('#FFFFFF');
    }
    
    // Prepara os dados para inserção
    const timestamp = new Date();
    const nome = data.nome || '';
    const evento = data.evento || 'Aniversário Adrielly - 19 anos';
    const ip = getClientIP();
    const userAgent = getUserAgent();
    
    // Adiciona nova linha com os dados
    const newRow = [timestamp, nome, evento, ip, userAgent];
    sheet.appendRow(newRow);
    
    // Formata a nova linha
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow, 1, 1, newRow.length);
    
    // Alterna cores das linhas
    if (lastRow % 2 === 0) {
      range.setBackground('#F8F4F3');
    }
    
    // Formata a data
    sheet.getRange(lastRow, 1).setNumberFormat('dd/mm/yyyy hh:mm:ss');
    
    // Ajusta largura das colunas automaticamente
    sheet.autoResizeColumns(1, newRow.length);
    
    return {
      row: lastRow,
      data: newRow,
      timestamp: timestamp
    };
    
  } catch (error) {
    console.error('Erro ao adicionar dados na planilha:', error);
    throw error;
  }
}

/**
 * Obtém o IP do cliente (limitado no Apps Script)
 */
function getClientIP() {
  try {
    // O Apps Script não fornece IP real do cliente
    return 'N/A';
  } catch (error) {
    return 'Erro ao obter IP';
  }
}

/**
 * Obtém o User Agent do cliente (limitado no Apps Script)
 */
function getUserAgent() {
  try {
    // O Apps Script não fornece User Agent real
    return 'Web Browser';
  } catch (error) {
    return 'Erro ao obter User Agent';
  }
}

/**
 * Função para testar a integração
 */
function testIntegration() {
  const testData = {
    nome: 'Teste de Integração',
    evento: 'Teste - Aniversário Adrielly',
    timestamp: new Date().toLocaleString('pt-BR')
  };
  
  try {
    const result = addToSheet(testData);
    console.log('Teste realizado com sucesso:', result);
    return result;
  } catch (error) {
    console.error('Erro no teste:', error);
    throw error;
  }
}

/**
 * Função para obter estatísticas das confirmações
 */
function getStats() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return { total: 0, message: 'Nenhuma confirmação ainda' };
    }
    
    const lastRow = sheet.getLastRow();
    const total = lastRow > 1 ? lastRow - 1 : 0; // Subtrai 1 para não contar o cabeçalho
    
    return {
      total: total,
      message: `Total de ${total} confirmação(ões) de presença`
    };
    
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return { total: 0, error: error.toString() };
  }
}

/**
 * Função para limpar dados de teste (use com cuidado!)
 */
function clearTestData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return 'Nenhuma aba encontrada';
    }
    
    // Remove todas as linhas exceto o cabeçalho
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    
    return 'Dados de teste removidos com sucesso';
    
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    throw error;
  }
}

