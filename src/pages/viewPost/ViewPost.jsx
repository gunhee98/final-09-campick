import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostItem from "../../components/post/PostItem";
import Comment from "../../components/comment/Comment";
import {
  CommentSection,
  WrapViewPost,
  CommentUploadButton,
  WrapCommentWrite,
  CommentProfileImage,
  CommentInputArea,
} from "../viewPost/viewPost.style";
import { ProfileNav } from "../../components/post/post.style";
import { Helmet } from "react-helmet-async";
import { viewPost } from "../../api/viewpostApi";
import { myInfo } from "../../api/myInfoApi";
import { uploadComment, getCommentList } from "../../api/commentApi";
import HeaderText from "../../components/header/HeaderText";
import PostMap from "../../components/post/PostMap";

export default function ViewPost() {
  const { post_id } = useParams();
  const [data, setPostData] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [comments, setComments] = useState([]);
  const [myProfilePic, setMyProfilePic] = useState("");
  const [myAccountName, setMyAccountName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const loadMyInfo = async () => {
    try {
      const getMyInfo = await myInfo();
      setMyProfilePic(getMyInfo.image);
      setMyAccountName(getMyInfo.accountname);
    } catch (error) {
      console.error("오류 발생", error);
      throw error;
    }
  };

  const handlecommentContentChange = e => {
    const value = e.target.value;
    setCommentContent(value);
    setIsActive(value.length > 0);
  };

  const handleCommentUpload = async () => {
    if (!isActive || isUploading) return;
    setIsUploading(true); // 업로드 시작

    try {
      const response = await uploadComment(post_id, commentContent);

      if (response && response.comment) {
        setTimeout(() => {
          setComments(prevComments => [response.comment, ...prevComments]);
        }, 500); // 새로운 댓글 리스트
        {
          setCommentContent("");
        } // 입력창 초기화

        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
        setCommentCount(prevCount => prevCount + 1);
      }
    } catch (error) {
      console.error("댓글 업로드 실패: ", error);
    } finally {
      setIsUploading(false); // 업로드 종료
    }
  };
  console.log(comments);

  useEffect(() => {
    loadMyInfo();
  }, []);

  useEffect(() => {
    const getPostAndComments = async () => {
      try {
        const fetchedPost = await viewPost(post_id);
        setPostData(fetchedPost);
        setCommentCount(fetchedPost.commentCount);

        const fetchedComments = await getCommentList(post_id);
        setComments(fetchedComments);
      } catch (error) {
        console.error("error", error);
      }
    };
    getPostAndComments();
  }, [post_id]);

  return (
    <>
      <Helmet>
        <title>Campic | 게시글 상세</title>
      </Helmet>
      <HeaderText text={""} />
      <WrapViewPost>
        <PostMap location = {data && JSON.parse(data.content).location}/>
        {data && <PostItem data={data} commentCount={commentCount} />}
        <CommentSection>
          {comments &&
            [...comments].reverse().map(comment => (
              <ProfileNav to={`/profile/${comment.author.accountname}`}>
                <Comment
                  key={comment.id}
                  comment={comment}
                  currentUsername={myAccountName}
                />
              </ProfileNav>
            ))}
        </CommentSection>

        <WrapCommentWrite>
          <CommentProfileImage
            src={myProfilePic}
            alt={`${myAccountName}의 프로필 이미지입니다.`}
          />
          <CommentInputArea
            value={commentContent}
            onChange={handlecommentContentChange}
            placeholder="댓글을 입력하세요..."
          />
          <CommentUploadButton
            onClick={handleCommentUpload}
            disabled={!isActive || isUploading || commentContent.length === 0}
          >
            게시
          </CommentUploadButton>
        </WrapCommentWrite>
      </WrapViewPost>
    </>
  );
}
