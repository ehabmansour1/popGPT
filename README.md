# PopGPT - AI Model Interaction Platform

## ⚠️ Important: Environment Variables Setup

Before running this project, you need to create a `.env` file in the root directory with the following API keys:

```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

To obtain these API keys:

1. OpenAI API Key: Sign up at [OpenAI Platform](https://platform.openai.com)
2. DeepSeek API Key: Register at [DeepSeek](https://platform.deepseek.ai)
3. Gemini API Key: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
4. OpenRouter API Key: Register at [OpenRouter](https://openrouter.ai)

## 🚀 Project Overview

PopGPT is a modern web application built with React and Vite that allows users to interact with multiple AI models through a unified interface. The application provides a seamless experience for users to communicate with different AI models and compare their responses.

## 🛠️ Tech Stack

- **Frontend Framework**: React
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **State Management**: React Context
- **API Integration**: Firebase
- **Development Language**: JavaScript/JSX

## 📁 Project Structure

```
src/
├── assets/         # Static assets like images
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── firebase/       # Firebase configuration and utilities
├── pages/         # Application pages/routes
├── services/      # API and external service integrations
├── styles/        # Global styles and theme
├── utils/         # Helper functions and utilities
├── App.jsx        # Main application component
└── main.jsx       # Application entry point
```

## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/ehabmansour1/popGPT
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the root directory
   - Add the required API keys as shown in the Environment Variables section

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🔒 Security Considerations

- Never commit your `.env` file to version control
- Keep your API keys secure and rotate them regularly
- Follow security best practices when handling user data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support, please open an issue in the repository or contact the maintainers.
