import React from 'react'

const faqList = (props) => {
  return (
    <tr>
        <td>{ props.faq.faqTypeDescription }</td>
        <td className="text-left" onClick={() => props.onCallPopMethod(props.faq.faqId)}><a data-toggle="modal" data-target="#faqReg" className="textUnderline notiTitle" title="FAQ 자세히 보기">{ props.faq.title }</a></td>
        <td>{ props.faq.userName }</td>
        <td className="end">{ props.faq.createDate }</td>
    </tr>
  )
}

export default faqList
