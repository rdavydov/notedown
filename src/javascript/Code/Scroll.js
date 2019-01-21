export default class
{
    constructor(_options)
    {
        this.root = _options.root
        this.root.scroll = this

        // Scrollbar width
        this.scrollbarWidth = this.getScrollbarWidth()

        // Set up
        this.setElement()
        this.setInner()
        this.setOffset()
    }

    setElement()
    {
        this.$element = document.createElement('div')
        this.$element.style.right = `-${this.scrollbarWidth}px`
        this.$element.style.bottom = `-${this.scrollbarWidth}px`
        this.$element.classList.add('scroll')
        this.root.container.$element.appendChild(this.$element)
    }

    setInner()
    {
        this.$inner = document.createElement('div')
        this.$inner.classList.add('scroll-inner')
        this.$element.appendChild(this.$inner)
    }

    setOffset()
    {
        this.offset = {}
        this.offset.x = 0
        this.offset.y = 0

        this.$element.addEventListener('scroll', () =>
        {
            this.offset.x = this.$element.scrollLeft
            this.offset.y = this.$element.scrollTop
        })
    }

    updateOffset(_x, _y)
    {
        this.$element.scrollLeft = _x
        this.$element.scrollTop = _y
    }

    getScrollbarWidth()
    {
        const $inner = document.createElement('div')
        $inner.style.width = '100%'
        $inner.style.height = '200px'

        const $outer = document.createElement('div')
        $outer.style.position = 'absolute'
        $outer.style.top = '0px'
        $outer.style.left = '0px'
        $outer.style.visibility = 'hidden'
        $outer.style.width = '200px'
        $outer.style.height = '150px'
        $outer.style.overflow = 'hidden'
        $outer.appendChild($inner)

        document.body.appendChild($outer)
        const width1 = $inner.offsetWidth
        $outer.style.overflow = 'scroll'
        let width2 = $inner.offsetWidth
        if(width1 === width2)
        {
            width2 = $outer.clientWidth
        }

        document.body.removeChild($outer)

        return width1 - width2
    }

    forceInView()
    {
        // Left
        if(this.root.cursor.x < this.offset.x + this.root.measures.character.width * 3)
        {
            this.updateOffset(this.root.cursor.x - this.root.measures.character.width * 3, this.offset.y)
        }

        // Right
        if(this.root.cursor.x > this.offset.x + this.root.measures.viewport.width - this.root.measures.character.width * 3)
        {
            this.updateOffset(this.root.cursor.x - this.root.measures.viewport.width + this.root.measures.character.width * 3, this.offset.y)
        }

        // Up
        if(this.root.cursor.y < this.offset.y)
        {
            this.updateOffset(this.offset.x, Math.floor(this.root.cursor.y / this.root.measures.character.height) * this.root.measures.character.height)
        }

        // Down
        if(this.root.cursor.y > this.offset.y + this.root.measures.viewport.height - this.root.measures.character.height)
        {
            this.updateOffset(this.offset.x, Math.floor((this.root.cursor.y - this.root.measures.viewport.height + this.root.measures.character.height) / this.root.measures.character.height) * this.root.measures.character.height)
        }
    }
}
