# Project Structure

```
mc_image_processer/
├── frontend/                # Next.js frontend application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   ├── pages/           # Next.js pages
│   │   ├── styles/          # CSS/styling files
│   │   └── utils/           # Utility functions
│   ├── next.config.js       # Next.js configuration
│   ├── package.json         # Frontend dependencies
│   └── .gitignore           # Git ignore file for frontend
├── backend/                 # FastAPI backend application
│   ├── app/                 # Application code
│   │   ├── api/             # API endpoints
│   │   ├── core/            # Core configurations
│   │   ├── services/        # Business logic services
│   │   │   └── image_processing/ # Image processing algorithms
│   │   └── models/          # Data models
│   ├── main.py              # FastAPI entry point
│   ├── requirements.txt     # Python dependencies
│   └── .gitignore           # Git ignore file for backend
├── .gitignore               # Main Git ignore file
└── README.md                # Project documentation
