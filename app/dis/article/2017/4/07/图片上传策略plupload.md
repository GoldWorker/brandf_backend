##基于plupload上传预处理图片的考虑
###步骤
- 使用input[file]
    - 预处理
    - canver
        - fileReader
            - 可得到size等信息
        - todataurl
    - resize
    - 此时得到葛系base64编码的图片数据
- addFile()
- ####建议先将图片预处理完再使用plupload add，否则plupload中的事件将难以控制
- 但系尚未试过用plupload上传base64编码的文件

###看起来似乎吾错的方法
    `var file = new mOxie.File(null, dataUrl);
    file.name = "filename.jpg"; // you need to give it a name here (required)
    _uploader.addFile(file);`