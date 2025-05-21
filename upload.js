import { v2 as cloudinary } from 'cloudinary';
import env from 'dotenv'
import fs from 'fs';
import path from 'path';

env.config();


(async function () {
    try {
        // Cấu hình Cloudinary
        cloudinary.config({ 
            cloud_name: process.env.CLOUD_NAME, 
            api_key: process.env.API_KEY, 
            api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
        });

        console.log("Cloudinary Config:", cloudinary.config());

        // Đường dẫn thư mục chứa ảnh
        const folderPath = './image';

        // Lấy danh sách tất cả các file trong thư mục
        const files = fs.readdirSync(folderPath).filter(file => 
            file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')
        );

        console.log(`🔍 Tìm thấy ${files.length} ảnh trong thư mục.`);

        // Upload từng ảnh
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            console.log(`📤 Đang upload: ${file} ...`);

            try {
                const uploadResult = await cloudinary.uploader.upload(filePath, {
                    folder: 'uploaded_images', // Đặt thư mục trên Cloudinary
                    resource_type: 'image'
                });

                console.log(`✅ Upload thành công: ${file}`);
                console.log("🔗 URL:", uploadResult.secure_url);

            } catch (uploadError) {
                console.error(`❌ Lỗi khi upload ${file}:`, uploadError);
            }
        }

        console.log("🎉 Hoàn tất upload tất cả ảnh!");

    } catch (error) {
        console.error("Lỗi:", error);
    }
})();