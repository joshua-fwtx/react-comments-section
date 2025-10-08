import CommentStructure from '../CommentStructure.tsx/Index'
import InputField from '../InputField/Index'
import './CommentSection.css'
import { useContext } from 'react'
import { GlobalContext } from '../../context/Provider'
import _ from 'lodash'
import React from 'react'
import LoginSection from '../LoginSection/LoginSection'
import NoComments from './NoComments'

interface CommentSectionProps {
  overlayStyle?: object
  logIn: {
    loginLink?: string | (() => void)
    signUpLink?: string | (() => void)
    onLogin?: string | (() => void)
    onSignUp?: string | (() => void)
  }
  hrStyle?: object
  titleStyle?: object
  replyBoxStyle?: object
  commentHeader?: (data: any) => React.ReactNode
  customNoComment?: Function
  showTimestamp?: boolean
  disableSections?: {
    header?: boolean
    postBox?: boolean
    reply?: boolean
  }
  replyButtonStyle?: object
  cancelButtonStyle?: object
  editorStyle?: object
}

const CommentSection = ({
  overlayStyle,
  logIn,
  hrStyle,
  titleStyle,
  replyBoxStyle,
  commentHeader,
  customNoComment,
  showTimestamp = true,
  disableSections,
  cancelButtonStyle,
  replyButtonStyle,
  editorStyle
}: CommentSectionProps) => {
  const handleLogin = () => {
    if (typeof logIn.onLogin === 'function') {
      logIn.onLogin()
    } else if (typeof logIn.loginLink === 'string') {
      window.location.href = logIn.loginLink
    }
  }

  const handleSignUp = () => {
    if (typeof logIn.onSignUp === 'function') {
      logIn.onSignUp()
    } else if (typeof logIn.signUpLink === 'string') {
      window.location.href = logIn.signUpLink
    }
  }

  const loginMode = () => {
    return <LoginSection loginLink={handleLogin} signUpLink={handleSignUp} />
  }
  const globalStore: any = useContext(GlobalContext)

  const totalComments = () => {
    let count = 0
    globalStore.data.map((i: any) => {
      count = count + 1
      i.replies.map(() => (count = count + 1))
    })
    return count
  }

  return (
    <div className='overlay' style={overlayStyle}>
      {disableSections?.header ? null : ( // hide header if disabled
        <React.Fragment>
          <span className='comment-title' style={titleStyle}>
            {globalStore.commentsCount || totalComments()}{' '}
            {totalComments() === 1 ? 'Commentamunda' : 'Commentamundos'}
          </span>
          <hr className='hr-style' style={hrStyle} />
        </React.Fragment>
      )}
      {disableSections?.postBox ? null : ( // hide header if disabled
        <React.Fragment>
          {globalStore.currentUserData === null ? (
            loginMode()
          ) : (
            <InputField
              placeHolder={globalStore.placeHolder}
              formStyle={{ margin: '10px 0px' }}
              imgDiv={{ margin: 0 }}
              replyBoxStyle={replyBoxStyle}
              cancelButtonStyle={cancelButtonStyle}
              replyButtonStyle={replyButtonStyle}
              editorStyle={editorStyle}
            />
          )}
        </React.Fragment>
      )}
      {globalStore.data.length > 0 ? (
        globalStore.data?.map(
          (i: {
            userId: string
            comId: string
            fullName: string
            avatarUrl: string
            text: string
            userProfile?: string
            replies: Array<any> | undefined
          }) => {
            return (
              <div key={i.comId}>
                <CommentStructure
                  info={i}
                  editMode={
                    _.indexOf(globalStore.editArr, i.comId) === -1
                      ? false
                      : true
                  }
                  replyMode={
                    _.indexOf(globalStore.replyArr, i.comId) === -1
                      ? false
                      : true
                  }
                  logIn={logIn}
                  commentHeader={commentHeader}
                  showTimestamp={showTimestamp}
                  disableSections={disableSections}
                  replyBoxStyle={replyBoxStyle}
                  cancelButtonStyle={cancelButtonStyle}
                  replyButtonStyle={replyButtonStyle}
                  editorStyle={editorStyle}
                />
                {i.replies &&
                  i.replies.length > 0 &&
                  i.replies.map((j) => {
                    return (
                      <div className='replySection' key={j.comId}>
                        <CommentStructure
                          info={j}
                          parentId={i.comId}
                          editMode={
                            _.indexOf(globalStore.editArr, j.comId) === -1
                              ? false
                              : true
                          }
                          replyMode={
                            _.indexOf(globalStore.replyArr, j.comId) === -1
                              ? false
                              : true
                          }
                          logIn={logIn}
                          commentHeader={commentHeader}
                          showTimestamp={showTimestamp}
                          disableSections={disableSections}
                          replyBoxStyle={replyBoxStyle}
                          cancelButtonStyle={cancelButtonStyle}
                          replyButtonStyle={replyButtonStyle}
                          editorStyle={editorStyle}
                        />
                      </div>
                    )
                  })}
              </div>
            )
          }
        )
      ) : customNoComment ? (
        customNoComment()
      ) : (
        <NoComments />
      )}
    </div>
  )
}

export default CommentSection
