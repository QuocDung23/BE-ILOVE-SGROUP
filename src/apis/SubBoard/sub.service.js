import { SubRepository } from "../../repositories/sub.repository.js";
import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { get } from "http";

const subRepo = new SubRepository();

class subService {
  constructor() {
    dotenv.config();
  }

  async getSubId(id) {
    const getSub = await subRepo.getSubId({ _id: id });
    if(!getSub) {
      throw new Error('Không có SubBroard này!')
    }
    return getSub;
  }
  async updateSub(id, update) {
    const getSub = await subRepo.getSubId(id);
    if (!getSub) {
      throw new Error("Không có Subboard này!");
    }

    const subInfo = {
      name: update.name || subInfo.name,
    };

    const updateSub = await subRepo.updateSub(id, { $set: subInfo });
    if (!updateSub) {
      throw new Error("Cập nhật thất bại");
    }
    return {
      name: update.name || updateSub.name,
    };
  }

  async deleteSub(id, user) {
    if(user.role !== 'admin') {
      throw new Error('Bạn không có quyền này!')
    }
    const deleteSub = await subRepo.deleteSub(id)
    return deleteSub
  }

  async uploadImages(subId, inputPath) {
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      });
  
      console.log('📦 Cloudinary Config Loaded');
  
      const subCheck = await subRepo.getSubId(subId);
      if (!subCheck) {
        throw new Error(`Không tìm thấy Sub Board với ID: ${subId}`);
      }
  
      const uploaded = [];
  
      const isUrl = inputPath.startsWith('http://') || inputPath.startsWith('https://');
      if (isUrl) {
        console.log(`🌐 Đang upload từ URL: ${inputPath}`);
        const uploadResult = await cloudinary.uploader.upload(inputPath, {
          folder: 'subboard_backgrounds',
          resource_type: 'image',
        });
  
        await subRepo.updateSub(subId, {
          $push: { background: uploadResult.secure_url },
        });
  
        uploaded.push(uploadResult.secure_url);
  
        return {
          success: true,
          message: 'Đã upload ảnh từ URL thành công',
          images: uploaded,
        };
      }
  
      if (!fs.existsSync(inputPath)) {
        throw new Error(`Đường dẫn không tồn tại: ${inputPath}`);
      }
  
      const stats = fs.statSync(inputPath);
      if (stats.isFile()) {
        console.log(`🖼️ Đang upload file: ${inputPath}`);
        const uploadResult = await cloudinary.uploader.upload(inputPath, {
          folder: 'subboard_backgrounds',
          resource_type: 'image',
        });
  
        await subRepo.updateSub(subId, {
          $push: { background: uploadResult.secure_url },
        });
  
        uploaded.push(uploadResult.secure_url);
      } else if (stats.isDirectory()) {
        const files = fs.readdirSync(inputPath).filter((file) =>
          file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
        );
  
        if (files.length === 0) {
          return {
            success: false,
            message: 'Không tìm thấy ảnh nào trong thư mục',
            images: [],
          };
        }
  
        console.log(`📁 Tìm thấy ${files.length} ảnh trong thư mục`);
  
        for (const file of files) {
          const filePath = path.join(inputPath, file);
          try {
            console.log(`📤 Đang upload: ${file}...`);
            const uploadResult = await cloudinary.uploader.upload(filePath, {
              folder: 'subboard_backgrounds',
              resource_type: 'image',
            });
  
            await subRepo.updateSub(subId, {
              $push: { background: uploadResult.secure_url },
            });
  
            uploaded.push(uploadResult.secure_url);
          } catch (err) {
            console.error(`❌ Lỗi khi upload ảnh ${file}:`, err.message);
          }
        }
      } else {
        throw new Error(`Loại đường dẫn không hỗ trợ: ${inputPath}`);
      }
  
      return {
        success: uploaded.length > 0,
        message:
          uploaded.length > 0
            ? `Đã upload ${uploaded.length} ảnh thành công`
            : 'Không có ảnh nào được upload thành công',
        images: uploaded,
      };
    } catch (error) {
      console.error('❌ Lỗi:', error.message);
      return {
        success: false,
        message: `Lỗi khi upload ảnh: ${error.message}`,
        images: [],
      };
    }
  }

  restrictTo(...roles) {
    return async (user) => {
      if (!roles.includes(user.role)) {
        throw new Error("Bạn không có quyền thực hiện hành động này");
      }
      return true;
    };
  }
}

export default new subService();
