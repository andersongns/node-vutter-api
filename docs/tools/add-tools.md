# Add Tools
> Deve haver uma rota para cadastrar uma nova ferramenta

O corpo da requisição deve conter as informações da ferramenta a ser cadastrada, sem o ID (gerado automaticamente pelo servidor). A resposta, em caso de sucesso, deve ser o mesmo objeto, com seu novo ID gerado.

```json
{
     "title": "hotel",
     "link": "https://github.com/typicode/hotel",
     "description": "Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.",
     "tags":["node", "organizing", "webapps", "domain", "developer", "https", "proxy"]
 }    
```