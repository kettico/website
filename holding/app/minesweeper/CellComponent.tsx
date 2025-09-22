import { MSCell } from "@/types/Minesweeper"
import styles from "./minesweeper.module.css"

export default function CellComponent({
    CellData,
    onClick,
    onRightClick,
} : {
    CellData : MSCell,
    onClick: () => void;
    onRightClick: () => void;
}) {
    let text = '';
    let colorClass = '';

    if (CellData.status === 'revealed') {
    if (CellData.value === -1) {
        text = '💣';
        colorClass = styles.bomb;
    } else {
        text = CellData.value ? String(CellData.value) : '';
        colorClass = styles[`num${CellData.value}`]; // e.g. num1, num2, etc.
    }
    } else if (CellData.status === 'flagged') {
    text = '🚩';
    }


    function handleRightClick(){
        // TODO: Stop context menu
        if (CellData.status == 'revealed') return;
        onRightClick();
    }

      return (
        <div className={`${styles.cell} ${styles[CellData.status]} ${colorClass}`}
        onClick={onClick}
        onContextMenu={(e) => {
            e.preventDefault();
            onRightClick();
        }}>
            {text}
        </div>

    );

}