document.addEventListener('DOMContentLoaded', () => {
    // Elementos da interface
    const chatInput = document.querySelector('input[type="text"]');
    const chatArea = document.querySelector('.flex-1.space-y-4');
    const navLinks = document.querySelectorAll('nav a');
    const logoutBtn = document.querySelector('a[href="#logout"]');
    
    // Navegação
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href === '#logout') {
                fetch('/logout', { method: 'POST' })
                    .then(() => window.location.href = '/login');
            } else {
                window.location.href = href;
            }
        });
    });
    
    // Chat functionality
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && chatInput.value.trim()) {
                sendMessage(chatInput.value.trim());
                chatInput.value = '';
            }
        });
    }
    
    // API Functions
    async function sendMessage(message) {
        try {
            // Add user message to chat
            addMessageToChat('user', message);
            
            // Send to backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            if (data.status === 'success') {
                addMessageToChat('ai', data.response);
            } else {
                addMessageToChat('ai', 'Desculpe, ocorreu um erro ao processar sua mensagem.');
            }
        } catch (error) {
            console.error('Error:', error);
            addMessageToChat('ai', 'Desculpe, ocorreu um erro ao processar sua mensagem.');
        }
    }
    
    function addMessageToChat(type, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start space-x-4';
        
        const avatar = document.createElement('div');
        avatar.className = type === 'ai' ? 
            'w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500' :
            'w-10 h-10 rounded-full bg-gray-600';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'flex-1';
        
        const messageP = document.createElement('p');
        messageP.className = 'text-lg';
        messageP.textContent = message;
        
        contentDiv.appendChild(messageP);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);
        
        chatArea.appendChild(messageDiv);
        
        // Scroll to bottom
        chatArea.scrollTop = chatArea.scrollHeight;
    }
    
    // Resumos functionality
    const resumoForm = document.querySelector('#resumo-form');
    if (resumoForm) {
        resumoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const titulo = document.querySelector('#titulo').value;
            const texto = document.querySelector('#texto').value;
            
            try {
                const response = await fetch('/api/resumos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ titulo, texto })
                });
                
                const data = await response.json();
                if (data.status === 'success') {
                    alert('Resumo criado com sucesso!');
                    resumoForm.reset();
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Erro ao criar resumo.');
            }
        });
    }
    
    // Questões functionality
    const questaoForm = document.querySelector('#questao-form');
    if (questaoForm) {
        questaoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const pergunta = document.querySelector('#pergunta').value;
            const resposta = document.querySelector('#resposta').value;
            const tipo = document.querySelector('#tipo').value;
            
            try {
                const response = await fetch('/api/questoes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pergunta, resposta, tipo })
                });
                
                const data = await response.json();
                if (data.status === 'success') {
                    alert('Questão criada com sucesso!');
                    questaoForm.reset();
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Erro ao criar questão.');
            }
        });
    }
}); 