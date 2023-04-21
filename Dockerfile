# 使用 Node.js 18.x 作为基础镜像
FROM --platform=linux/amd64 node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果存在）到工作目录
COPY package*.json ./

# 安装依赖项
RUN npm install


# 拷贝应用程序代码到容器中
COPY . .

# 构建应用程序
RUN npm run build

# 向外公开端口，这里的3000是NestJS应用程序默认的端口号
EXPOSE 3000

# 运行 NestJS 应用程序
CMD [ "npm", "run", "start:prod" ]
