const getFileMetaData = (givenFile: Express.Multer.File) => {
  const file = givenFile;
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${Math.random()}-${crypto.randomUUID()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  return { file, fileExt, fileName, filePath };
};

export default getFileMetaData;
