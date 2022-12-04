export const utilService = {
    getTime,
    isDifferentDate,
    getTimeDiff,
    getLongFormDate
}

function isDifferentDate(timestamp1, timestamp2) {
    const date1 = new Date(timestamp1)
    const date2 = new Date(timestamp2)

    const day1 = date1.getDate()
    const day2 = date2.getDate()
    const month1 = date1.getMonth()
    const month2 = date2.getMonth()
    const year1 = date1.getFullYear()
    const year2 = date2.getFullYear()

    const date1string = `${day1}-${month1}-${year1}`
    const date2string = `${day2}-${month2}-${year2}`


    return day1 !== day2 || month1 !== month2 || year1 !== year2
}



function getTime(timestamp) {
    const datetime = new Date(timestamp)
    const today = new Date()

    const timeDiffMilliseconds = Math.abs(datetime - today)
    const timeDiffDays = Math.floor(timeDiffMilliseconds / 1000 / 60 / 60 / 24)

    const day = datetime.getDate().toString().padStart(2, '0')
    const month = (datetime.getMonth() + 1).toString().padStart(2, '0')
    const year = datetime.getFullYear()
    const hours = datetime.getHours().toString().padStart(2, '0')

    const minutes = datetime.getMinutes().toString().padStart(2, '0')

    return {
        getDatetimeStr() {
            if (timeDiffDays === 0) return `Today at ${hours}:${minutes}`
            if (timeDiffDays === 1) return `Yesterday at ${hours}:${minutes}`
            else return `${day}/${month}/${year} at ${hours}:${minutes}`
        },
        getTimeStr() {
            return `${hours}:${minutes}`
        }
    }
}

function getTimeDiff(timestamp1, timestamp2) {
    let milliseconds = Math.abs(new Date(timestamp1) - new Date(timestamp2))
    const secs = Math.floor(Math.abs(milliseconds) / 1000)
    const mins = Math.floor(secs / 60)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)
    const millisecs = Math.floor(Math.abs(milliseconds)) % 1000
    const diffString = (n, term) => n === 1 ? `1 ${term}` : `${n} ${term}s`

    return {
        secs,
        mins,
        hours,
        days,
        millisecs,
        diffString() {
            if (this.mins === 0) return `${this.secs} seconds ago`
            if (this.mins >= 1 && this.mins <= 60) return `${this.mins} minutes ago`
            if (this.hours === 1) return `${this.hours} hours ago`
            if (this.hours > 1 && this.hours < 24) return 'Couple of hours ago'
            if (this.day === 1) return `1 Day ago`
            if (this.day > 1) return `Couple of days ago`
        }
    }
}

function getLongFormDate(ts) {
    const date = new Date(ts.timestamp)
    const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear()

    return `${month} ${day}, ${year}`
}

