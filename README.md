[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/j-otaqSD)
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

### Commande pour la création de l'image Docker
```docker build -t student-frontend .```

### Commande pour lancer le container
```docker run -d -p 5173:80 --name student-frontend student-frontend```

## ✔️ 1. Arrêter le conteneur (s’il tourne)
```docker stop student-frontend```

## ✔️ 2. Supprimer le conteneur
```docker rm student-frontend```

## ✔️ 3. Rebuild l'image
```docker build -t student-frontend .```

## ✔️ 4. Lancer le conteneur
```docker run -d -p 5173:80 --name student-frontend student-frontend```
