import {useEffect, useMemo, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useImmer} from "use-immer";
import {lengthOfPagination, numberToArray} from "../utils/numberEditors";
import styles from './Pagination.module.css'
import arrowLeftSvg from 'assets/arrow_left.svg'
import arrowRightSvg from 'assets/arrow_right.svg'
interface IPagination {
    pages: number
    size?: number
}

export const Pagination = (props: IPagination) => {
    const { pages, size = 10 } = props
    const lengthArray = lengthOfPagination(pages, size)
    const [searchParams, setSearchParams] = useSearchParams()
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page'))) // change current page
    const [paginateInArray, setPaginateInArray] = useImmer<number[]>([0])

    const getLeft = () => {
        const newArray: number[] = []
        paginateInArray.map((page: number) => newArray.push(page - 4))
        if (!(newArray[0] < 4)) {
            setPaginateInArray(newArray)
        } else {
            setPaginateInArray(sizeInArray.slice(0, 4))
        }
    }

    const getRight = () => {
        const newArray: number[] = []
        paginateInArray.map((page: number) => newArray.push(page + 4))
        if (!(newArray[newArray.length - 1] > lengthArray)) {
            setPaginateInArray(newArray)
        } else {
            setPaginateInArray(sizeInArray.slice(sizeInArray.length - 4))
        }
    }

    const getLastArray = () => {
        const arrayForSlice = [...sizeInArray]
        setPaginateInArray(arrayForSlice.splice(-4))
    }
    const navigateToPage = (item: number) => {
        setCurrentPage(item)
        searchParams.set('page', item.toString())
        setSearchParams(searchParams)
    }

    const sizeInArray = useMemo(() => {
        return numberToArray(lengthArray - 1)
    }, [lengthOfPagination])

    useEffect(() => {
        if (sizeInArray.length === 0) {
            setPaginateInArray([])
        } else {
            if (sizeInArray.length < 4) {
                setPaginateInArray(sizeInArray)
            } else if (currentPage === Number(sizeInArray.at(-1)) + 1) {
                setPaginateInArray([...sizeInArray].splice(-4))
            } else if (currentPage < 4) {
                setPaginateInArray([...sizeInArray].slice(0, 4))
            } else if (currentPage === sizeInArray.length) {
                setPaginateInArray([...sizeInArray].slice(currentPage - 4, currentPage + 1))
            } else {
                setPaginateInArray([...sizeInArray].slice(currentPage - 3, currentPage + 1))
            }
        }
    }, [currentPage, sizeInArray, lengthOfPagination])

    return (
        <div className={styles.paginateContainer}>
            {sizeInArray.length > 4 && (
                <img
                    className={styles.paginateImage}
                    src={arrowLeftSvg}
                    alt="Get Left x4"
                    onClick={() => getLeft()}
                />
            )}
            {paginateInArray.length > 0 && (
                <div className={styles.paginateList}>
                    {paginateInArray.map((item, index) => {
                        return (
                            <button
                                className={`${styles.paginateButton} ${
                                    (item === currentPage || !currentPage) && styles.paginateButtonActive
                                }`}
                                key={index}
                                type="button"
                                onClick={() => {
                                    navigateToPage(item)
                                }}
                            >
                                {item}
                            </button>
                        )
                    })}
                    {sizeInArray.length > 4 && <span>...</span>}
                    <button
                        className={`${styles.paginateButton} ${
                            (sizeInArray.slice(-1)[0] + 1 || Number(0)) === currentPage &&
                            styles.paginateButtonActive
                        }`}
                        type="button"
                        onClick={() => {
                            getLastArray()
                            navigateToPage(Number(sizeInArray.at(-1)) + 1)
                            setCurrentPage(Number(sizeInArray.at(-1)) + 1 || 0)
                        }}
                    >
                        {sizeInArray.slice(-1)[0] + 1 || '0'}
                    </button>
                </div>
            )}
            {sizeInArray.length > 4 && (
                <img
                    className={styles.paginateImage}
                    src={arrowRightSvg}
                    alt="Get Right x4"
                    onClick={() => getRight()}
                />
            )}
        </div>
    )
}