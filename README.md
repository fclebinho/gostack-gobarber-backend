# Recuperação de senha

**RF**

- O usuário pode recuperar sua senha informando seu email;
- Ao solicitar a recuperação de senha, o usuário deve receber um email com as intruções de recuperação de senha;
- O usuário pode resetar sua senha;

**RNF**

- Utilizar Mailtrap para testar envios de email em ambiente de desenvolvimento;
- Utilizar Amazon SES para envio de emails em produção;
- O envio de email deve acontecer em segundo plano (background job);

**RN**

- O link para resetar senha enviado por email, deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;

# Atualização de senha

**RF**

- O usuário deve atualizar seu nome, email, e senha;

**RNF**

- O usuário não deve alterar seu email para um email já utlizado;
- Para atualizar senha, o usuário deve informar a senha antiga;
- Para atualizar senha, o usuário deve confirmar a nova senha;

# Painel do prestador

**RF**

- O usuário pode listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houve um novo agendamento;
- O prestador pode visualizar as notificações não lidas;

**RNF**

- Os agendamentos do prestador devem ser armazenados em cache;
- As notificações devem ser armazenadas em banco não-relacional;
- As notificações do prestador  devem ser enviadas através do socket.io em tempo-real;

**RN**

- A notificação deve ter um status de lida ou não-lida para que o prestador possa as controla-las;

# Agendamento de serviços

**RF**

- O usuário deve listar todos prestadores de serviços cadastrados;
- O usuário deve listar os dias de um mês com pelo menos um horário disponível de um prestador;
- O usuário deve listar horários disponíveis em um dia específico de um prestador;
- O usuário deve realizar um novo agendamento com um prestador;

**RNF**

- Listagem dos prestadores devem ser armazenadas em cache;

**RN**

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem repeitar horário comercial sendo 8h às 18h;
- O usuário não deve agendar um horário já ocupado;
- O usuário não deve agendar um horário que já passou;
- O usuário não deve agendar serviços consigo mesmo;
