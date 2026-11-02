# Aurora Glamour — loja pública

Este repositório contém a vitrine pública da Aurora Glamour para GitHub Pages, com produtos em JSON e imagens enviadas manualmente.

- [Como cadastrar produtos e fotos](COMO_ADICIONAR_PRODUTOS.md)
- [Catálogo de produtos](data/products.json)
- [Informações públicas da loja](data/store.json)
- [Publicação automática](.github/workflows/pages.yml)

## Publicação

Em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**. A automação publica o conteúdo após commits na branch main. O endereço esperado após a confirmação é:

https://borizy.github.io/vendas/

Verifique que a página abre antes de divulgá-la.

## Cadastro manual

O catálogo começa vazio: []. Coloque fotos suas ou autorizadas em assets/images, depois edite data/products.json seguindo COMO_ADICIONAR_PRODUTOS.md. Os novos produtos aparecerão após a atualização do site.

## WhatsApp

O WhatsApp temporário usado nos botões da loja é **+55 (34) 99993-6104**. O envio automático de pedidos ainda precisa de Cloudflare Worker, credenciais da Meta e aprovação do template; atualmente está **desativado**. Não há backend de pedidos ativo nem pagamentos online.

## Privacidade e fonte dos dados

Este repositório é público e não deve conter credenciais, dados de clientes nem pedidos. Seu código privado de desenvolvimento continua em borizy/loja; **alterar apenas os produtos no repositório privado NÃO atualiza a loja publicada**. Faça o cadastro aqui, em borizy/vendas, para que as alterações apareçam no site.
