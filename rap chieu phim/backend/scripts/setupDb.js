const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function setupDatabase() {
  console.log('--- KHỞI TẠO & ĐỒNG BỘ CƠ SỞ DỮ LIỆU MYSQL CINEMA MANAGEMENT ---');
  
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  
  console.log(`Đang kết nối tới MySQL Server tại ${host}:${port} với user '${user}'...`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true,
    });
    console.log('Kết nối thành công đến MySQL Server!');
  } catch (err) {
    console.error('Không thể kết nối tới MySQL:', err.message);
    console.error('Vui lòng kiểm tra lại dịch vụ MySQL (XAMPP / MySQL Service / Docker).');
    process.exit(1);
  }

  try {
    // 1. Thực thi file schema & seed cơ bản (cinema_management.sql)
    const sqlFilePath = path.join(__dirname, '..', '..', 'cinema_management.sql');
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`Không tìm thấy file SQL tại ${sqlFilePath}`);
    }

    console.log(`Đang đọc file SQL gốc: ${sqlFilePath}...`);
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('Đang thực thi các lệnh tạo bảng và nạp dữ liệu mẫu (Seed Data)...');
    await connection.query(sqlContent);
    console.log('  ✔ Khởi tạo cấu trúc & dữ liệu nền hoàn tất.');

    // 2. Tự động áp dụng tất cả các migration theo thứ tự tuần tự
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs
        .readdirSync(migrationsDir)
        .filter((f) => f.endsWith('.sql'))
        .sort();

      console.log(`\nTìm thấy ${migrationFiles.length} file migration trong thư mục: ${migrationsDir}`);
      for (const migFile of migrationFiles) {
        console.log(`Đang áp dụng migration: ${migFile}...`);
        const migPath = path.join(migrationsDir, migFile);
        const migSql = fs.readFileSync(migPath, 'utf8');
        await connection.query(migSql);
        console.log(`  ✔ Migration ${migFile} áp dụng thành công.`);
      }
    }

    console.log('\n====================================================');
    console.log('THÀNH CÔNG! Đã khởi tạo và đồng bộ CSDL cinema_management hoàn chỉnh.');
    console.log('Mọi bảng, cột, khóa bản quyền KDM và dữ liệu ghế 72/phòng đã sẵn sàng.');
    console.log('====================================================');
  } catch (err) {
    console.error('Lỗi khi thực thi khởi tạo CSDL:', err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setupDatabase();
