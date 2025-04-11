document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.querySelector('input[type="text"]');
    const chatArea = document.querySelector('.flex-1.space-y-4');
    
    // Handle chat input
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatInput.value.trim()) {
            sendMessage(chatInput.value.trim());
            chatInput.value = '';
        }
    });

    // Handle button clicks
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonText = button.textContent.trim();
            if (buttonText === '🔍') {
                if (chatInput.value.trim()) {
                    sendMessage(chatInput.value.trim());
                    chatInput.value = '';
                }
            }
            // Add handlers for other buttons (mic, upload) here
        });
    });

    function sendMessage(message) {
        // Add user message
        addMessageToChat('user', message);
        
        // Simulate AI response (this will be replaced with actual backend call)
        setTimeout(() => {
            addMessageToChat('ai', 'Esta é uma resposta simulada. Integração com o backend pendente.');
        }, 1000);
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
}); 