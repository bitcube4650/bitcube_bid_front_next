import React from 'react'
import { ListProps } from 'components/types'

const faqList = (props: ListProps) => {
  return (
    <tr>
        <td>{ props.content.faqTypeDescription }</td>
        <td className="text-left" onClick={() => props.onCallPopMethod && props.onCallPopMethod(props.content.faqId)}><a data-toggle="modal" data-target="#faqReg" className="textUnderline notiTitle" title="FAQ 자세히 보기">{ props.content.title }</a></td>
        <td>{ props.content.userName }</td>
        <td className="end">{ props.content.createDate }</td>
    </tr>
  )
}

export default faqList
