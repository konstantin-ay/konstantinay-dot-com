build "web" {
  base    = "node"
  command = "pnpm install --frozen-lockfile && pnpm build"
}

service "web" {
  build   = build.web
  command = "pnpm start"

  endpoint {
    public = true
  }

  env = {
    PORT = port
  }

  dev {
    command = "pnpm dev"
  }
}
