import React from 'react';
import { ProductDetail } from '@features/products/domain/entities/Product.entity';
import { Collapsible } from '@shared/ui/components';
import styles from './ProductSpecs.module.css';

export interface ProductSpecsProps {
  product: ProductDetail;
  defaultOpen?: boolean;
}

interface SpecRow {
  label: string;
  value: string;
}

const formatValue = (value: unknown): string | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  if (Array.isArray(value)) {
    const filtered = value.filter(v => v !== null && v !== undefined && v !== '');
    return filtered.length > 0 ? filtered.join(', ') : null;
  }
  
  return String(value);
};

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ 
  product,
  defaultOpen = false 
}) => {
  const specs: SpecRow[] = [
    { label: 'Network Technology', value: formatValue(product.networkTechnology) },
    { label: 'Network Speed', value: formatValue(product.networkSpeed) },
    { label: 'GPRS', value: formatValue(product.gprs) },
    { label: 'EDGE', value: formatValue(product.edge) },
    { label: 'Announced', value: formatValue(product.announced) },
    { label: 'Status', value: formatValue(product.status) },
    { label: 'Dimensions', value: formatValue(product.dimentions) },
    { label: 'Weight', value: product.weight ? `${product.weight}g` : null },
    { label: 'SIM', value: formatValue(product.sim) },
    { label: 'Display Type', value: formatValue(product.displayType) },
    { label: 'Display Size', value: formatValue(product.displaySize) },
    { label: 'Display Resolution', value: formatValue(product.displayResolution) },
    { label: 'Operating System', value: formatValue(product.os) },
    { label: 'Chipset', value: formatValue(product.chipset) },
    { label: 'CPU', value: formatValue(product.cpu) },
    { label: 'GPU', value: formatValue(product.gpu) },
    { label: 'Internal Memory', value: formatValue(product.internalMemory) },
    { label: 'External Memory', value: formatValue(product.externalMemory) },
    { label: 'RAM', value: formatValue(product.ram) },
    { label: 'Primary Camera', value: formatValue(product.primaryCamera) },
    { label: 'Secondary Camera', value: formatValue(product.secondaryCmera) },
    { label: 'Speaker', value: formatValue(product.speaker) },
    { label: 'Audio Jack', value: formatValue(product.audioJack) },
    { label: 'WLAN', value: formatValue(product.wlan) },
    { label: 'Bluetooth', value: formatValue(product.bluetooth) },
    { label: 'GPS', value: formatValue(product.gps) },
    { label: 'NFC', value: formatValue(product.nfc) },
    { label: 'Radio', value: formatValue(product.radio) },
    { label: 'USB', value: formatValue(product.usb) },
    { label: 'Sensors', value: formatValue(product.sensors) },
    { label: 'Battery', value: formatValue(product.battery) },
  ].filter((spec): spec is SpecRow => spec.value !== null) as SpecRow[];

  if (specs.length === 0) {
    return <><p>No technical specifications available.</p></>;
  }

  return (
    <Collapsible title="Technical Specifications" defaultOpen={defaultOpen}>
      <div className={styles.specs}>
        {specs.map((spec) => (
          <React.Fragment key={spec.label}>
            <dt className={styles.label}>{spec.label}</dt>
            <dd className={styles.value}>{spec.value}</dd>
          </React.Fragment>
        ))}
      </div>
    </Collapsible>
  );
};
