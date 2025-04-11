# EstudeFacil.AI

Uma plataforma de estudo inteligente que utiliza IA para auxiliar no aprendizado.

## Requisitos

- Python 3.11 ou superior
- Ollama instalado e rodando localmente
- Navegador web moderno

## Configuração

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd estudefacil-ai
```

2. Crie e ative o ambiente virtual:
```bash
python -m venv venv
# No Windows:
venv\Scripts\activate
# No Linux/Mac:
source venv/bin/activate
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Certifique-se que o Ollama está instalado e rodando com o modelo Mistral:
```bash
ollama pull mistral
ollama run mistral
```

## Executando o Projeto

1. Inicie o servidor Flask:
```bash
python src/app.py
```

2. Abra o navegador e acesse:
```
http://localhost:5000
```

## Estrutura do Projeto

```
estudefacil-ai/
├── src/
│   └── app.py
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
├── templates/
│   └── index.html
├── venv/
├── requirements.txt
└── README.md
```

## Funcionalidades

- Chat interativo com IA
- Sistema de histórico de conversas
- Interface moderna e responsiva
- Integração com Ollama para processamento local de IA
- Banco de dados SQLite para armazenamento de conversas

## Próximos Passos

- [ ] Implementar sistema de autenticação
- [ ] Adicionar suporte a múltiplos modelos de IA
- [ ] Migrar para PostgreSQL
- [ ] Adicionar testes automatizados
- [ ] Implementar sistema de flashcards
- [ ] Adicionar suporte a upload de arquivos 