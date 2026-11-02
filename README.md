# Aurora Glamour — loja pública

Este repositório contém a vitrine pública da Aurora Glamour para GitHub Pages, com produtos em JSON e imagens enviadas manualmente.

- [Como cadastrar produtos e fotos](COMO_ADICIONAR_PRODUTOS.md)
- [Catálogo de produtos](data/products.json)
- [Informações públicas da loja](data/store.json)
- [Publicação automática](.github/workflows/pages.yml)

## Publicação

**Situação da primeira tentativa (02/11/2026):** o workflow tentou publicar, mas o GitHub recusou porque Pages ainda não está ativado. Para concluir:

1. Abra https://github.com/borizy/vendas/settings/pages .
2. Em **Build and deployment → Source**, escolha **GitHub Actions**.
3. Abra https://github.com/borizy/vendas/actions/workflows/pages.yml .
4. Clique **Run workflow** (se aparecer; use a aba **Actions** no navegador desktop) e selecione **main**.
5. Veja a execução em verde e a URL indicada em Settings → Pages.

Depois disso, a automação publica atualizações do site nos commits em main. O endereço esperado após confirmação é:

https://borizy.github.io/vendas/

Verifique que a página abre antes de divulgá-la.

## Cadastro manual

O catálogo começa vazio: []. Coloque fotos suas ou autorizadas em assets/images, depois edite data/products.json seguindo COMO_ADICIONAR_PRODUTOS.md. Os novos produtos aparecerão após a atualização do site.

## WhatsApp

O WhatsApp temporário usado nos botões da loja é **+55 (34) 99993-6104**. O envio automático de pedidos ainda precisa de Cloudflare Worker, credenciais da Meta e aprovação do template; atualmente está **desativado**. Não há backend de pedidos ativo nem pagamentos online.

## Privacidade e fonte dos dados

Este repositório é público e não deve conter credenciais, dados de clientes nem pedidos. Seu código privado de desenvolvimento continua em borizy/loja; **alterar apenas os produtos no repositório privado NÃO atualiza a loja publicada**. Faça o cadastro aqui, em borizy/vendas, para que as alterações apareçam no site.
