import styles from './place.module.css';

export type PCell = {
  row: number;
  col: number;
  color: string;
};

export default function PCellComponent({
  PCell,
  onClick,
}: {
  PCell: PCell;
  onClick: (row: number, col: number) => void;
}) {
  return (
    <div
      className={styles.cell}
      style={{
        backgroundColor: PCell.color,
      }}
      onClick={() => onClick(PCell.row, PCell.col)}
    />
  );
}
