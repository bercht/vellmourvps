# Etapa 1: Base Ruby e dependências nativas
FROM ruby:3.3.7-slim

WORKDIR /app

# Instalar dependências do sistema, Node.js, npm e Yarn
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libyaml-dev \
    pkg-config \
    nodejs \
    npm \
    imagemagick \
    ca-certificates \
  && npm install -g yarn \
  && rm -rf /var/lib/apt/lists/*

# Instalar gems (inclui Bundler por padrão)
COPY Gemfile Gemfile.lock ./
RUN bundle install --jobs 4 --retry 3

# Instalar dependências JS via Yarn
COPY package.json yarn.lock ./
RUN yarn install --check-files

# Copiar todo o código e pré-compilar assets
COPY . ./
RUN APP_HOST=example.com RAILS_ENV=production SECRET_KEY_BASE_DUMMY=1 rails assets:precompile

# Porta padrão para Rails
EXPOSE 3000

# Comando padrão ao iniciar o container
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3000"]
