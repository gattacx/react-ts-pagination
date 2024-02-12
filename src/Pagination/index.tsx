import {useEffect, useMemo, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useImmer} from "use-immer";
import {numberToArray} from "../utils/numberEditors";

interface IPagination {
    pages: number
    size?: number
}

export const Pagination = (props: IPagination) => {
    const { pages, size = 10 } = props
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
        if (!(newArray[newArray.length - 1] > pages)) {
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
        return numberToArray(pages - 1)
    }, [pages])

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
    }, [currentPage, sizeInArray, pages])

    return (
        <div>Pag</div>
    )
}