#!/bin/bash

echo "🪄 Bắt đầu niệm chú..."
git add .

# Nếu có tham số truyền vào thì dùng nó làm message, không thì dùng "Update"
if [ -z "$1" ]
then
  COMMIT_MSG="Cập nhật giao diện đơn hàng & fix lỗi"
else
  COMMIT_MSG="$1"
fi

echo "📦 Đóng gói: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

echo "🚀 Đẩy code lên trời..."
git push

echo "✅ Hoàn tất thần chú!"



git add .
git commit -m "làm lại giao diện chi tiết đơn hàng"
git push -u origin main
