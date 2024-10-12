# gRPC for Node.jsでgRPCを理解する

ブログ記事 [現代アプリケーションにおけるWeb APIの実装形式 (1) gRPC](https://tknf.dev/application/modern-applications-grpc-web-api)のサンプルコードです。

## インストール
```sh
$ pnpm install
```

## セットアップ
gRPCのprotoファイルをコンパイルします。
```sh
$ pnpm run setup
```

## データベースの準備
SQLite3のデータベースのマイグレーションを実行します。
```sh
$ pnpm run db:migrate
```

## サーバーの起動
```sh
$ pnpm run start
```

※このプロジェクトは学習・検証用に作成されたものです。本番環境には使用しないでください。
