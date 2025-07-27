// Configurações e variáveis globais
const CONFIG = {
    // URL do Google Apps Script para integração com Google Sheets
    GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/AKfycbx44qlDq901KfA1WoIPdwsw912YAGEwssqrAQEdGkDRkfFJ-rWY5wf7dUijupPDch7u/exec',
    SPREADSHEET_ID: '1ntTy0PuYQEGGh095nqg_U9OLyKTZ3T8Sz_kHpLd07U0',
    // Link de pagamento do Nubank
    PAYMENT_LINK: 'https://nubank.com.br/cobrar/9pdjs7/68855fc2-ad99-4459-826b-7ff44b252dac'
};

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupFormHandling();
    addInteractiveEffects();
});

// Inicializa as animações da página
function initializeAnimations() {
    // Animação de entrada escalonada para elementos
    const elements = document.querySelectorAll('.invitation-card > *');
    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.3}s`;
    });

    // Animação contínua dos pontos decorativos
    animateDecorativeDots();
    
    // Animação das bolhas na taça
    animateWineBubbles();
    
    // Efeito de parallax suave no scroll
    setupParallaxEffect();
}

// Anima os pontos decorativos
function animateDecorativeDots() {
    const dots = document.querySelectorAll('.dot');
    
    dots.forEach((dot, index) => {
        // Animação de flutuação aleatória
        setInterval(() => {
            const randomX = Math.random() * 10 - 5;
            const randomY = Math.random() * 10 - 5;
            const randomScale = 0.8 + Math.random() * 0.4;
            
            dot.style.transform = `translate(${randomX}px, ${randomY}px) scale(${randomScale})`;
        }, 2000 + index * 500);
    });
}

// Anima as bolhas na taça de vinho
function animateWineBubbles() {
    const bubbles = document.querySelectorAll('.bubble');
    
    bubbles.forEach((bubble, index) => {
        setInterval(() => {
            bubble.style.animationDuration = `${1.5 + Math.random()}s`;
        }, 3000 + index * 200);
    });
}

// Configura efeito de parallax suave
function setupParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.decorative-dots');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Configura o tratamento do formulário
function setupFormHandling() {
    const form = document.getElementById('rsvpForm');
    const submitBtn = form.querySelector('.submit-btn');
    const nameInput = document.getElementById('nome');

    // Validação em tempo real
    nameInput.addEventListener('input', function() {
        validateInput(this);
    });

    // Submissão do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        
        if (!name) {
            showNotification('Por favor, digite seu nome', 'error');
            return;
        }

        // Mostra estado de carregamento
        setLoadingState(submitBtn, true);

        try {
            // Envia para FormSubmit (email)
            await submitToFormSubmit(form, name);
            
            // Envia para Google Sheets
            await submitToGoogleSheets(name);
            
            // Sucesso - mostra seção de pagamento
            showPaymentSection(name);
            form.reset();
            
        } catch (error) {
            console.error('Erro ao confirmar presença:', error);
            showNotification('Erro ao confirmar presença. Tente novamente.', 'error');
        } finally {
            setLoadingState(submitBtn, false);
        }
    });
}

// Valida entrada do usuário
function validateInput(input) {
    const value = input.value.trim();
    const inputGroup = input.closest('.input-group');
    
    if (value.length < 2) {
        inputGroup.classList.add('error');
    } else {
        inputGroup.classList.remove('error');
    }
}

// Envia dados para FormSubmit
async function submitToFormSubmit(form, name) {
    const formData = new FormData();
    formData.append('NOME', name);
    formData.append('_captcha', 'false');
    formData.append('_subject', 'Nova confirmação de presença - Aniversário Adrielly');
    
    const response = await fetch(form.action, {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('Erro no FormSubmit');
    }
}

// Envia dados para Google Sheets
async function submitToGoogleSheets(name) {
    const data = {
        nome: name,
        timestamp: new Date().toLocaleString('pt-BR'),
        evento: 'Aniversário Adrielly - 19 anos'
    };

    // Envia para o Google Apps Script
    const response = await fetch(CONFIG.GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors', // Importante para evitar bloqueio de CORS
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    // Não há como checar o status com 'no-cors', mas o dado será enviado
}

// Define estado de carregamento do botão
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Mostra notificação para o usuário
function showNotification(message, type = 'info') {
    // Remove notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Cria nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Adiciona estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-pink)' : type === 'error' ? '#e74c3c' : 'var(--text-dark)'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        font-family: 'Cormorant Garamond', serif;
    `;
    
    // Adiciona ao DOM
    document.body.appendChild(notification);
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Botão de fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    });
}

// Adiciona efeitos interativos
function addInteractiveEffects() {
    // Efeito hover na taça
    const wineGlass = document.querySelector('.wine-glass');
    if (wineGlass) {
        wineGlass.addEventListener('mouseenter', () => {
            wineGlass.style.transform = 'scale(1.05) rotate(2deg)';
            wineGlass.style.transition = 'transform 0.3s ease';
        });
        
        wineGlass.addEventListener('mouseleave', () => {
            wineGlass.style.transform = 'scale(1) rotate(0deg)';
        });
    }
    
    // Efeito de clique nos pontos decorativos
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            dot.style.animation = 'none';
            dot.offsetHeight; // Força reflow
            dot.style.animation = 'floatDot 0.5s ease-out';
        });
    });
    
    // Efeito de digitação no input
    const nameInput = document.getElementById('nome');
    if (nameInput) {
        nameInput.addEventListener('focus', () => {
            nameInput.parentElement.style.transform = 'scale(1.02)';
            nameInput.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        nameInput.addEventListener('blur', () => {
            nameInput.parentElement.style.transform = 'scale(1)';
        });
    }
}

// Adiciona animações CSS dinâmicas
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        

        
        .input-group.error .input-line::after {
            background: #e74c3c !important;
            width: 100% !important;
        }
        
        .input-group.error label {
            color: #e74c3c !important;
        }
        
        .notification-message {
            flex: 1;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .notification-close:hover {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
}

// Inicializa estilos dinâmicos
addDynamicStyles();

// Função para integração com Google Sheets (a ser configurada)
function setupGoogleSheetsIntegration() {
    // Esta função será usada para configurar a integração com Google Sheets
    // Instruções:
    // 1. Criar um Google Apps Script
    // 2. Configurar permissões para a planilha
    // 3. Atualizar a URL no CONFIG.GOOGLE_SHEETS_URL
    
    console.log('Para configurar Google Sheets:');
    console.log('1. Acesse script.google.com');
    console.log('2. Crie um novo projeto');
    console.log('3. Cole o código do Apps Script fornecido');
    console.log('4. Configure as permissões');
    console.log('5. Atualize a URL no arquivo script.js');
}

// Mostra a seção de pagamento após confirmação
function showPaymentSection(name) {
    // Remove seção de pagamento existente se houver
    const existingPaymentSection = document.querySelector('.payment-section');
    if (existingPaymentSection) {
        existingPaymentSection.remove();
    }

    // Cria a seção de pagamento
    const paymentSection = document.createElement('div');
    paymentSection.className = 'payment-section';
    paymentSection.innerHTML = `
        <div class="payment-container">
            <div class="payment-header">
                <h2>🎉 Obrigada, ${name}!</h2>
                <p>Sua presença foi confirmada com sucesso!</p>
            </div>
            
            <div class="payment-info">
                <h3>Para finalizar sua confirmação, realize o pagamento:</h3>
                <div class="payment-details">
                    <p><strong>Valor:</strong> R$ 30,00</p>
                    <p><strong>Forma de pagamento:</strong> PIX</p>
                    <p><strong>Beneficiário:</strong> Adrielly Freire Torres</p>
                </div>
                
                <div class="payment-instructions">
                    <p><strong>Instruções:</strong></p>
                    <ol>
                        <li>Clique no botão abaixo para acessar o link de pagamento</li>
                        <li>Escaneie o QR Code ou copie e cole o código abaixo.</li>
                        <li>Confirme o pagamento no seu app bancário</li>
                        <li>Pronto! Sua confirmação está completa</li>
                    </ol>
                </div>
                
                <div class="payment-button-container">
                    <a href="${CONFIG.PAYMENT_LINK}" target="_blank" class="payment-button">
                        <span class="payment-text">Pagar R$ 30,00 via PIX</span>
                    </a>
                </div>
                

            </div>
            
            <button class="close-payment-btn" onclick="closePaymentSection()">
                <span>✕</span>
            </button>
        </div>
    `;

    // Adiciona ao DOM
    document.body.appendChild(paymentSection);
}

// Função para mostrar apenas o link de pagamento (sem confirmação de presença)
function showPaymentOnly() {
    // Remove seção de pagamento existente se houver
    const existingPaymentSection = document.querySelector('.payment-section');
    if (existingPaymentSection) {
        existingPaymentSection.remove();
    }

    // Cria a seção de pagamento simplificada
    const paymentSection = document.createElement('div');
    paymentSection.className = 'payment-section';
    paymentSection.innerHTML = `
        <div class="payment-container">
            <div class="payment-header">
                <h2>Link de Pagamento</h2>
                <p>Acesse o link abaixo para realizar o pagamento</p>
            </div>
            
            <div class="payment-info">
                <div class="payment-details">
                    <p><strong>Valor:</strong> R$ 30,00</p>
                    <p><strong>Forma de pagamento:</strong> PIX</p>
                    <p><strong>Beneficiário:</strong> Adrielly Freire Torres</p>
                </div>
                
                <div class="payment-instructions">
                    <p><strong>Instruções:</strong></p>
                    <ol>
                        <li>Clique no botão abaixo para acessar o link de pagamento</li>
                        <li>Escaneie o QR Code ou copie e cole o código abaixo.</li>
                        <li>Confirme o pagamento no seu app bancário</li>
                        <li>Pronto! Seu pagamento está confirmado</li>
                    </ol>
                </div>
                
                <div class="payment-button-container">
                    <a href="${CONFIG.PAYMENT_LINK}" target="_blank" class="payment-button">
                        <span class="payment-text">Pagar R$ 30,00 via PIX</span>
                    </a>
                </div>
             
            </div>
            
            <button class="close-payment-btn" onclick="closePaymentSection()">
                <span>✕</span>
            </button>
        </div>
    `;

    // Adiciona ao DOM
    document.body.appendChild(paymentSection);
}

// Função para fechar a seção de pagamento
function closePaymentSection() {
    const paymentSection = document.querySelector('.payment-section');
    if (paymentSection) {
        paymentSection.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => {
            paymentSection.remove();
        }, 300);
    }
}

