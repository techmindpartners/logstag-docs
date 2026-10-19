import React, {type ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {ThemedComponent} from '@docusaurus/theme-common';
import styles from './styles.module.css';

type Props = {
  /**
   * Folder under static/ with the diagram's SVGs and interactive index.html,
   * such as "/diagrams/architecture/".
   */
  src: string;
  /** Alternative text of the image. */
  title: string;
};

/**
 * Shows an Archify diagram as the SVG of the active color mode and links its
 * interactive viewer. scripts/export-diagram-svg.mjs writes an animated SVG
 * and a still one per color mode; readers who prefer reduced motion get the
 * still one. The page needs no script or frame for the animation.
 */
export default function ArchifyDiagram({src, title}: Props): ReactNode {
  const folder = useBaseUrl(src);
  return (
    <figure className={styles.figure}>
      <ThemedComponent>
        {({theme, className}) => (
          <picture className={className}>
            <source
              media="(prefers-reduced-motion: reduce)"
              srcSet={`${folder}${theme}-still.svg`}
            />
            <img className={styles.image} src={`${folder}${theme}.svg`} alt={title} />
          </picture>
        )}
      </ThemedComponent>
      <figcaption className={styles.caption}>
        <a href={folder} target="_blank" rel="noopener">
          Open the interactive diagram in a new tab
        </a>
      </figcaption>
    </figure>
  );
}
