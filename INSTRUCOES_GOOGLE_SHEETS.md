# Instruções para Configurar Google Sheets API

## Passo a Passo para Integração

### 1. Preparar a Planilha do Google Sheets

1. Acesse a planilha: https://docs.google.com/spreadsheets/d/1ntTy0PuYQEGGh095nqg_U9OLyKTZ3T8Sz_kHpLd07U0/edit
2. Certifique-se de que você tem permissão de edição
3. A planilha será automaticamente configurada pelo script

### 2. Criar o Google Apps Script

1. Acesse: https://script.google.com
2. Clique em "Novo projeto"
3. Renomeie o projeto para "Convite Adrielly - API"
4. Substitua todo o código padrão pelo conteúdo do arquivo `google-apps-script.js`
5. Salve o projeto (Ctrl+S)

### 3. Configurar Permissões

1. No Apps Script, clique em "Executar" para testar
2. Autorize as permissões solicitadas:
   - Acesso ao Google Sheets
   - Acesso à internet
3. Confirme todas as permissões

### 4. Implantar como Aplicação Web

1. No Apps Script, clique em "Implantar" > "Nova implantação"
2. Escolha o tipo: "Aplicativo da Web"
3. Configurações:
   - **Descrição**: "API para confirmações de presença"
   - **Executar como**: "Eu (seu email)"
   - **Quem tem acesso**: "Qualquer pessoa"
4. Clique em "Implantar"
5. **IMPORTANTE**: Copie a URL da aplicação web gerada

### 5. Atualizar o Código JavaScript

1. Abra o arquivo `script.js`
2. Localize a linha com `GOOGLE_SHEETS_URL`
3. Substitua `'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'` pela URL copiada no passo anterior
4. Salve o arquivo

### 6. Testar a Integração

1. No Google Apps Script, vá para "Funções"
2. Selecione `testIntegration`
3. Clique em "Executar"
4. Verifique se uma linha de teste foi adicionada na planilha

### 7. Configurar o FormSubmit

1. No arquivo `index.html`, localize a linha:
   ```html
   <form action="https://formsubmit.co/your@email.com" method="POST">
   ```
2. Substitua `your@email.com` pelo seu email real
3. Salve o arquivo

## Estrutura da Planilha

A planilha será automaticamente configurada com as seguintes colunas:

| Timestamp | Nome | Evento | IP | User Agent |
|-----------|------|--------|----|-----------| 
| Data/Hora | Nome do convidado | Nome do evento | Endereço IP | Navegador |

## Funcionalidades Implementadas

### ✅ Confirmações Automáticas
- Cada confirmação é automaticamente adicionada à planilha
- Timestamp automático em formato brasileiro
- Dados organizados e formatados

### ✅ Validação de Dados
- Verificação de nome obrigatório
- Tratamento de erros
- Feedback visual para o usuário

### ✅ Segurança
- CORS configurado para permitir acesso
- Validação de dados no servidor
- Logs de erro para debugging

## Solução de Problemas

### Erro: "Script function not found"
- Verifique se o código foi colado corretamente
- Certifique-se de que salvou o projeto

### Erro: "Permission denied"
- Execute a função `testIntegration` primeiro
- Autorize todas as permissões solicitadas

### Erro: "Spreadsheet not found"
- Verifique se o ID da planilha está correto
- Confirme se você tem acesso à planilha

### Formulário não envia
- Verifique se a URL do Apps Script está correta no `script.js`
- Confirme se a aplicação web foi implantada corretamente

## Monitoramento

### Ver Confirmações
- Acesse a planilha para ver todas as confirmações em tempo real
- Os dados são organizados cronologicamente

### Estatísticas
- No Apps Script, execute a função `getStats()` para ver o total de confirmações

### Logs de Erro
- No Apps Script, vá em "Execuções" para ver logs detalhados

## Manutenção

### Limpar Dados de Teste
- Execute a função `clearTestData()` no Apps Script (use com cuidado!)

### Backup
- Faça backup regular da planilha
- Mantenha uma cópia do código do Apps Script

## Contato e Suporte

Se encontrar problemas:
1. Verifique os logs no Google Apps Script
2. Confirme se todas as permissões foram concedidas
3. Teste a função `testIntegration()` primeiro

---

**Nota**: Esta integração permite que qualquer pessoa com acesso ao formulário adicione dados à planilha. Certifique-se de que isso está de acordo com suas necessidades de privacidade.

