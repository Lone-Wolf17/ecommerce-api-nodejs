import multer from "multer";

const FILE_TYPE_MAP: Map<string, string> = new Map([
    ["image/png", "png"],
    ["image/jpeg", "jpeg"],
    ["image/jpg", "jpg"],
  ]);
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const isValid = FILE_TYPE_MAP.get(file.mimetype);
      let uploadError: Error | null = new Error("Invalid image type");
  
      if (isValid) uploadError = null;
  
      cb(uploadError, "images");
    },
    filename: function (req, file, cb) {
      const filename = file.originalname.replace(" ", "-");
      const extension = FILE_TYPE_MAP.get(file.mimetype);
      cb(null, `${filename}-${Date.now()}.${extension}`);
    },
  });
  
  export const uploadOptions = multer({ storage: storage });
  