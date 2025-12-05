import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@shared/ui/components';
import styles from './Home.module.css';

export const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header
        className={styles.hero}
        title="Molaya ITX"
        subtitle="E-commerce Project with Clean Architecture and Design System"
      />
      
      <div className={styles.hero}>
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.icon}>🎨</span>
            <h3>Design System</h3>
            <p>Reusable components with CSS Modules and Flexbox</p>
          </div>
          
          <div className={styles.feature}>
            <span className={styles.icon}>🏗️</span>
            <h3>Clean Architecture</h3>
            <p>Layer separation: Domain, Application, Infrastructure</p>
          </div>
          
          <div className={styles.feature}>
            <span className={styles.icon}>⚡</span>
            <h3>TypeScript</h3>
            <p>Strong typing for better security and maintainability</p>
          </div>
        </div>

        <div className={styles.actions}>
          <Link to="/design" className={styles.primaryLink}>
            View Design System
          </Link>
          <Link to="/products" className={styles.secondaryLink}>
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
};
