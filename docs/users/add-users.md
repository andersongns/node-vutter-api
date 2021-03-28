# Add Tools
> Deve haver uma rota para cadastrar um novo usuário

O corpo da requisição deve conter as informações do usuário a ser cadastrado, sem o ID (gerado automaticamente pelo servidor). Retornando algumas informações do usuario com o token de autenticação.

```json
{
     "name": "Anderson Santos",
     "email": "anderson.santos@tuta.io",
     "password": "strong-password",
 }    
```