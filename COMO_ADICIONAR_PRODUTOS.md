# Como adicionar produtos na Aurora Glamour

Este tutorial é para cadastrar os produtos **manualmente pelo GitHub**, sem Firebase e sem painel administrativo.

## 1. Enviar as fotos

1. Abra o repositório: https://github.com/borizy/vendas
2. Entre na pasta `assets/images`.
3. Clique em **Add file > Upload files**.
4. Selecione uma imagem sua em JPG, PNG ou preferencialmente WEBP.
5. Use um nome simples sem espaços nem acentos. Exemplo: `batom-rosa.webp`.
6. Clique em **Commit changes**. Para melhor velocidade, prefira imagens leves (por exemplo, menos de 500 KB).

Não use fotos de produtos de terceiros sem autorização.

## 2. Cadastrar o produto no JSON

1. Abra o arquivo [data/products.json](https://github.com/borizy/vendas/blob/main/data/products.json).
2. Toque no **ícone de lápis** (Edit this file).
3. O arquivo começa como `[]`, isto é, **nenhum produto cadastrado**.
4. Substitua-o por um array como o exemplo abaixo; troque todos os dados de exemplo pelos dados reais.
5. Clique em **Commit changes**.

```json
[
  {
    "id": "batom-rosa-001",
    "name": "Batom Rosa",
    "brand": "Marca Exemplo",
    "category": "Lábios",
    "price": 19.9,
    "image": "./assets/images/batom-rosa.webp",
    "description": "Batom de acabamento suave",
    "active": true
  }
]
```

**Significado dos campos**

- `id`: identificador exclusivo. Não repita o mesmo ID em outros produtos.
- `name`: nome exibido na loja.
- `brand`: marca usada também nos filtros.
- `category`: grupo da loja. Categorias sugeridas: `Lábios`, `Rosto`, `Olhos`, `Cuidados`, `Acessórios`.
- `price`: preço em reais, com ponto decimal e sem `R$`, por exemplo `19.90`.
- `image`: endereço relativo da foto que foi enviada.
- `description`: descrição opcional para futura apresentação detalhada.
- `active`: `true` para mostrar; `false` para ocultar temporariamente.

## 3. Adicionar mais de um produto

Para cadastrar mais produtos, insira uma vírgula entre os objetos do array:

```json
[
  {
    "id": "item-001",
    "name": "Produto A",
    "brand": "Marca A",
    "category": "Cuidados",
    "price": 19.9,
    "image": "./assets/images/produto-a.webp",
    "active": true
  },
  {
    "id": "item-002",
    "name": "Produto B",
    "brand": "Marca B",
    "category": "Lábios",
    "price": 9.5,
    "image": "./assets/images/produto-b.webp",
    "active": true
  }
]
```

**Atenção:** não coloque vírgula depois do último campo ou depois do último produto. Um JSON inválido impede o catálogo de carregar.

## 4. Alterar, retirar ou excluir produtos

Para mudar preço ou nome, edite o mesmo arquivo. Para ocultar sem apagar, deixe `active: false`. Para remover definitivamente, apague o objeto correspondente do array e ajuste as vírgulas.

O carrinho é salvo no navegador do cliente, mas produtos que deixam de existir ou são desativados são eliminados dele quando a loja recarrega.

## 5. Publicar as alterações

Quando a publicação do site no GitHub Pages estiver ativada, o workflow [Publicar Aurora Glamour](https://github.com/borizy/vendas/actions) será disparado nos commits de `data/products.json` ou arquivos de imagem. Assim que a nova versão for publicada, os produtos aparecerão na loja.

## 6. WhatsApp temporário

O número de contato e destino temporário de notificações é **+55 (34) 99993-6104**. Ele está em:

- `data/store.json` — `whatsappNumber`: botões de contato/redirecionamento.
- `worker/wrangler.jsonc` — `OWNER_WHATSAPP`: destinatário de notificações futuras.

Não altere `META_PHONE_NUMBER_ID` para esse número: o campo exige o **ID de número emissor da API oficial**, fornecido pela Meta, não o número de telefone digitado.

O envio automático **não funciona ainda**: é necessário configurar Cloudflare Worker, token do WhatsApp Business Cloud API, modelo aprovado e Turnstile, conforme README.md.
