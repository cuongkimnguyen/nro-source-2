# Claude Code Project Kit — NRO Server Improve + Admin Portal

Bộ này dùng để đặt vào root của `nro-source-2` sau khi bạn giải nén source game. Mục tiêu là biến Claude Code thành một coding assistant có quy trình rõ ràng để:

1. Audit và fix bug Java game server.
2. Improve kiến trúc Maven/Docker/Linux deployment.
3. Thêm feature mới an toàn, có migration SQL và test/manual verification.
4. Generate admin portal web dựa trên style/logic từ `web.zip` PHP.
5. Tách rõ rule, skill, agent, command và hook để Claude không sửa bừa.

## Cách dùng nhanh

```bash
unzip nro-source-2.zip -d ./workspace
cd ./workspace/nro-source-2
cp -R /path/to/claude_nro_project/. .
mkdir -p reference
unzip /path/to/web.zip -d reference/web-source
claude
```

Sau đó dùng các command/prompt trong `.claude/commands/`:

```text
/audit-game-server
/fix-found-bugs
/generate-admin-portal
/add-game-feature
/harden-docker-linux
/security-review
```

## Repo context đã được tailor theo source hiện tại

- Game server Java Maven/JAR.
- Source chính nằm trong `src/nro/models/...` và một số class legacy trong `src/models/...`.
- DB MySQL, SQL bootstrap chính là `sql/nro1.sql`.
- Docker hiện có `docker-compose.yml`, `docker/app/Dockerfile`, `scripts/entrypoint.sh`.
- PHP web reference có cấu trúc kiểu `htdocs/Api`, `htdocs/Controllers`, `htdocs/Pages`, `htdocs/View`, `htdocs/Auth`.

## Nguyên tắc làm việc

Claude phải đọc code trước khi sửa. Không được đoán schema DB, không hardcode credential, không xóa module lớn nếu chưa có bằng chứng. Mỗi thay đổi phải có:

- Root cause hoặc feature intent.
- File list thay đổi.
- Build/test command.
- Manual verification steps.
- Rollback note.
