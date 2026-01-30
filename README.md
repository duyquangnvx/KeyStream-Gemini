# 🌌 Gemini Gateway: AI Key Weaver 🚀

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-lightgrey.svg)](https://socket.io/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini_API-Supported-ff69b4.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Giới Thiệu

**Gemini Gateway: AI Key Weaver** là một giải pháp reverse proxy hiệu suất cao được thiết kế để tối ưu hóa việc tương tác với Google Gemini API. Dự án này cung cấp một cơ chế xoay vòng khóa API (API Key Rotation) tiên tiến, quản lý tài nguyên hiệu quả và một giao diện người dùng (UI) trực quan để giám sát cũng như quản lý các khóa API và lưu lượng truy cập theo thời gian thực.

Mục tiêu chính là cung cấp một nền tảng ổn định và đáng tin cậy, giúp người dùng quản lý nhiều khóa Gemini API một cách liền mạch, giảm thiểu tình trạng bị giới hạn tỷ lệ (rate limit), và đảm bảo truy cập liên tục vào các mô hình AI tiên tiến của Google. Điều này không chỉ nâng cao hiệu suất làm việc mà còn tối ưu hóa chi phí vận hành.

## Các Tính Năng Chính

*   **Xoay Vòng Khóa API Thông Minh:** Tự động lựa chọn khóa API tối ưu từ một pool và chuyển đổi linh hoạt khi phát hiện lỗi hoặc giới hạn tỷ lệ.
*   **Giám Sát Thời Gian Thực:** Bảng điều khiển dựa trên web cung cấp biểu đồ lưu lượng truy cập trực tiếp, bảng trạng thái chi tiết của pool khóa API, và nhật ký terminal thời gian thực.
*   **Quản Lý Khóa Dễ Dàng:** Thêm và quản lý các khóa API một cách an toàn và trực quan thông qua giao diện người dùng, được lưu trữ cục bộ.
*   **Tự Động Phát Hiện Mô Hình:** Tự động quét và cập nhật danh sách các mô hình Gemini có sẵn từ Google API.
*   **Tích Hợp Socket.IO:** Đảm bảo cập nhật tức thì trên UI về trạng thái khóa, nhật ký hoạt động và biến động lưu lượng.
*   **Hỗ Trợ Streaming:** Xử lý hiệu quả các yêu cầu streaming từ Gemini API, mang lại trải nghiệm tương tác mượt mà.
*   **Khả Năng Tương Thích:** Cung cấp cấu hình dễ dàng để tích hợp với các công cụ phát triển AI khác (ví dụ: Continue.dev).

## Cài Đặt và Khởi Chạy

Thực hiện theo các bước sau để thiết lập và khởi chạy **Gemini Gateway: AI Key Weaver**:

### Yêu Cầu Hệ Thống

*   Node.js (phiên bản 18 hoặc cao hơn).
*   Trình quản lý gói npm hoặc Yarn.
*   Các khóa Google Gemini API (có thể được tạo tại [Google AI Studio](https://ai.google.dev/)).

### Các Bước Cài Đặt

1.  **Clone Repository:**
    Sử dụng Git để sao chép mã nguồn của dự án về máy cục bộ của bạn:
    ```bash
    git clone <URL_TO_YOUR_REPOSITORY>
    cd <YOUR_PROJECT_FOLDER>
    ```

2.  **Cài Đặt Dependencies:**
    Sử dụng npm hoặc Yarn để cài đặt tất cả các thư viện và phụ thuộc cần thiết cho dự án:
    ```bash
    npm install
    # Hoặc nếu bạn dùng Yarn:
    yarn install
    ```

3.  **Khởi Tạo Tệp `keys.json`:**
    Vì lý do bảo mật, tệp `keys.json` chứa các khóa API của bạn và **không** được thêm vào hệ thống kiểm soát phiên bản (đã được cấu hình trong `.gitignore`). Bạn cần tạo một tệp `keys.json` với nội dung JSON rỗng (`[]`) trong thư mục gốc của dự án trước khi khởi chạy server.

    *   **Trên macOS / Linux (Bash/Zsh):**
        ```bash
        echo "[]" > keys.json
        ```
    *   **Trên Windows (PowerShell):**
        ```powershell
        Set-Content -Path ".\keys.json" -Value "[]"
        ```
    Server sẽ tự động quản lý và ghi các khóa vào tệp này khi bạn thêm chúng thông qua giao diện người dùng.

4.  **Khởi Chạy Server:**
    Sau khi cài đặt dependencies và tạo tệp `keys.json`, bạn có thể khởi chạy server backend:
    ```bash
    npm start
    # Hoặc để khởi chạy trực tiếp bằng Node.js:
    node server.js
    ```
    Server sẽ khởi động và lắng nghe các yêu cầu tại địa chỉ mặc định: `http://localhost:13337`. Thông báo xác nhận sẽ hiển thị trong terminal của bạn.

## Hướng Dẫn Sử Dụng

### Giao Diện Người Dùng (UI)

Mở trình duyệt web của bạn và điều hướng đến `http://localhost:13337`. Bạn sẽ thấy bảng điều khiển quản lý **Gemini Gateway**, bao gồm các thành phần chính sau:

*   **LIVE_TRAFFIC_MONITOR:** Biểu đồ hiển thị dữ liệu về số lượng yêu cầu API được xử lý theo thời gian thực.
*   **INJECT_NEW_KEY:** Khu vực để bạn nhập và thêm các khóa Google Gemini API mới vào hệ thống. Các khóa sẽ được lưu trữ cục bộ trong `keys.json`.
*   **KEY_POOL_MATRIX:** Một bảng hiển thị chi tiết về tất cả các khóa API đã được thêm, bao gồm trạng thái hiện tại (Active/Cooldown), tổng số lần sử dụng và số lượng lỗi gặp phải.
*   **TERMINAL_OUTPUT:** Một cửa sổ hiển thị các nhật ký hoạt động và thông báo từ server backend.

### Cấu Hình Tích Hợp (Ví dụ: Continue.dev)

Để tích hợp **Gemini Gateway** với các công cụ phát triển AI như Continue.dev hoặc các ứng dụng khác hỗ trợ API tương thích OpenAI, hãy làm theo các bước sau:

1.  **Truy Cập Cấu Hình:** Trên giao diện UI của **Gemini Gateway**, nhấn vào nút `⚙️ GET CONFIG` để mở modal cấu hình.
2.  **Làm Mới Danh Sách Mô Hình:** Bạn có thể nhấn `🔄 SCAN GOOGLE MODELS` trong modal để đảm bảo danh sách các mô hình Gemini khả dụng là mới nhất.
3.  **Sao Chép Cấu Hình YAML:** Nhấn `COPY TO CLIPBOARD` để sao chép đoạn mã cấu hình YAML.
4.  **Dán vào Tệp Cấu Hình của Công Cụ AI:** Dán đoạn mã YAML đã sao chép vào tệp `config.yaml` của Continue.dev (hoặc tệp cấu hình tương tự của công cụ bạn đang sử dụng) dưới mục `models:`.

    *   `apiBase`: Luôn được đặt là `http://localhost:13337/v1`, trỏ đến proxy cục bộ của bạn.
    *   `apiKey`: Có thể là bất kỳ chuỗi giá trị nào (ví dụ: `sk-local-proxy`) vì **Gemini Gateway** sẽ tự động quản lý và sử dụng các khóa API thực tế từ pool của nó.

### Ví Dụ Cấu Hình `config.yaml` cho Continue.dev:

```yaml
# Các cấu hình khác của Continue.dev...

models:
  - name: "⚡ gemini-1.5-pro"
    model: "gemini-1.5-pro"
    provider: openai
    apiBase: "http://localhost:13337/v1"
    apiKey: "sk-local-proxy"
    contextLength: 128000
  - name: "⚡ gemini-1.5-flash"
    model: "gemini-1.5-flash"
    provider: openai
    apiBase: "http://localhost:13337/v1"
    apiKey: "sk-local-proxy"
    contextLength: 128000
  # Thêm các mô hình khác từ Gemini Gateway UI vào đây...

# ...Các cấu hình khác...
```

## Cấu Trúc Dự Án

```
.
├── config/              # Chứa các tệp cấu hình dự án
│   └── index.js         # Định nghĩa các biến môi trường và hằng số
├── public/              # Chứa các tệp frontend (HTML, CSS, JavaScript)
│   ├── index.html       # Giao diện người dùng chính của bảng điều khiển
│   ├── script.js        # Logic JavaScript tương tác với UI và backend
│   └── style.css        # Định nghĩa kiểu dáng CSS cho UI
├── routes/              # Định nghĩa các tuyến đường API của ứng dụng
│   └── apiRoutes.js     # Chứa logic định tuyến cho proxy và các API quản lý khóa
├── services/            # Chứa các dịch vụ và logic nghiệp vụ cốt lõi
│   ├── keyService.js    # Dịch vụ quản lý các khóa API (tải, lưu, xoay vòng, cập nhật trạng thái)
│   └── geminiService.js # Dịch vụ tương tác với Google Gemini API (tìm nạp mô hình, tạo nội dung)
├── utils/               # Chứa các hàm tiện ích chung (nếu có)
├── keys.json            # **Không được commit lên Git.** Tệp JSON lưu trữ các khóa API (khởi tạo trống).
├── server.js            # Điểm khởi đầu của ứng dụng backend (Express.js, Socket.IO)
├── package.json         # Danh sách các thư viện phụ thuộc và scripts của dự án
├── package-lock.json    # Ghi lại phiên bản chính xác của các dependencies
└── README.md            # Tài liệu dự án
```

## Phát Triển

Để chạy dự án ở chế độ phát triển với tính năng tự động khởi động lại server khi có thay đổi trong mã nguồn, bạn có thể sử dụng `nodemon`:

1.  **Cài đặt Nodemon (Nếu chưa có):**
    ```bash
    npm install -g nodemon
    ```
2.  **Khởi chạy Server với Nodemon:**
    ```bash
    nodemon server.js
    ```

## Góp Ý & Đóng Góp

Mọi góp ý, báo cáo lỗi và đóng góp mã nguồn đều được chào đón. Vui lòng mở một [issue](link_to_your_issue_tracker) để thảo luận hoặc gửi một [pull request](link_to_your_pull_requests) với các cải tiến của bạn.

## Giấy Phép

Dự án này được phân phối dưới Giấy phép MIT. Xem tệp [LICENSE](LICENSE) để biết thêm thông tin chi tiết.