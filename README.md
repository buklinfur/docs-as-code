# Docs as Code

Практическая работа по настройке среды Docs as Code.

Автор: Валерия Зайчикова

## Запуск

Требуется Python 3.

```bash
git clone https://github.com/buklinfur/docs-as-code.git
cd docs-as-code
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
mkdocs serve
```

Сайт откроется по адресу http://127.0.0.1:8000