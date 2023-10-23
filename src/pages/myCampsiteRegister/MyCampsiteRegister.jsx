import React, { useState } from 'react'
import { FileUploadContainer, HiddenFileInput, UploadButtonText, WrapperLabel, WrapperMyCampsiteInput, WrapperMyCampsiteRegister } from './MyCampsiteRegister.style'
import { Incorrect, InputStyle, Label, LabelStyle, Submitbutton } from '../../components/form/form.style'

import MapModal from '../../components/kakaomap/MapModal'
import { ModalBackdrop } from '../../components/kakaomap/MapModal.style'
import { Helmet } from 'react-helmet-async'

export default function MyCampsiteRegister() {
  const [price, setPrice] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [location, setLocation] = useState('')
  const [registerLink,setRegisterLink] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [warnings, setWarnings] = useState({
    image: null,
    companyName: null,
    price: null,
    location: null,
    registerLink: null,
    labels: null
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddressSelected = (selected) => {
    // 선택된 주소 받는 함수
    if(selected && selected.address_name){
      setSelectedAddress(selected);
      setLocation(selected.address_name)
      setCompanyName(selected.place_name)
      setRegisterLink(selected.place_url)
    }

  };
  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  function validation(e) {
  const value = e.target.value;
  switch (e.target.id) {
    case 'campsite-register-price':
      // 숫자만 입력되도록 검사
      const newValue = e.target.value.replace(/[^0-9]/g, '');
      setPrice(formatCurrency(newValue));
      break;
    case 'campsite-register-company-name':
      setCompanyName(value);
      break;
    case 'campsite-register-location':
      setLocation(value);
      break;
    case 'campsite-register-register-link':
      setRegisterLink(value);
      break;
    default:
      break;
  }
}
  const handleImageUpload = (event) => {
    // 이미지 업로드를 위한 함수
    const file = event.target.files[0];
    if (file) {
        // 선택한 파일을 처리하거나 서버에 업로드
      setPreviewImage(URL.createObjectURL(file));
    }
  };



  const handleLabelClick = (label) => {
    if (selectedLabels.includes(label)) {
      // 라벨이 이미 선택되어 있으면 배열에서 제거
        setSelectedLabels(prevLabels => prevLabels.filter(l => l !== label));
    } else {
        // 라벨이 선택되어 있지 않으면 배열에 추가
        setSelectedLabels(prevLabels => [...prevLabels, label]);
    }
  };

  const handleSubmitButton = ()=>{
    let newWarnings = {};

    if (!previewImage) newWarnings.image = "이미지를 업로드해주세요.";
    if (!companyName) newWarnings.companyName = "업체명을 입력해주세요.";
    if (!price) newWarnings.price = "가격을 입력해주세요.";
    if (!location) newWarnings.location = "위치를 입력해주세요.";
    if (!registerLink) newWarnings.registerLink = "예약 링크를 입력해주세요.";
    if (selectedLabels.length === 0) newWarnings.labels = "캠핑장 분위기를 하나 이상 선택해주세요.";

    setWarnings(newWarnings);

    if (!Object.values(newWarnings).some(w => w)) {
      console.log(previewImage, companyName, price, location, registerLink, selectedLabels);
    }

    if (!newWarnings){
      console.log() // 이미지
      console.log(companyName) // 업체명
      console.log(price) // 가격
      console.log(location) // 위치
      console.log(registerLink) // 예약 링크
      console.log(selectedLabels) // 캠핑장 분위기
    }


  }



  return (
    <>
      <Helmet>
				<title>Campick | 캠핑장 등록</title>
			</Helmet>
      <header>header</header>
      <WrapperMyCampsiteRegister>
        {isModalOpen && <ModalBackdrop onClick={closeModal}/>} {/* Modal이 열렸을 때만 배경 렌더링 */}
        <MapModal isOpen={isModalOpen} closeModal={closeModal} onAddressSelected={handleAddressSelected} />
        <WrapperMyCampsiteInput>
        <LabelStyle>이미지 등록</LabelStyle>
      <FileUploadContainer 
    onClick={() => document.getElementById("imageUpload").click()}
    $previewImage={previewImage}
    >
    <UploadButtonText $previewImage={previewImage}>클릭해서 이미지 업로드 하기</UploadButtonText>
    <HiddenFileInput id="imageUpload" type="file" onChange={handleImageUpload} />
      </FileUploadContainer>
      {warnings.image && <Incorrect>{warnings.image}</Incorrect>}
      </WrapperMyCampsiteInput>

        <Submitbutton onClick={openModal} style = {{margin:"0"}}>지도에서 위치 선택하기</Submitbutton>

        <WrapperMyCampsiteInput>
        <LabelStyle htmlFor='campsite-register-company-name'>업체명</LabelStyle>
        <InputStyle 
          id='campsite-register-company-name'
					type='text'
					value={companyName}
					onChange={validation}
					required
          placeholder='2-15자 이내여야 합니다.'/>
          {warnings.companyName && <Incorrect>{warnings.companyName}</Incorrect>}
        </WrapperMyCampsiteInput>

        <WrapperMyCampsiteInput>
        <LabelStyle htmlFor='campsite-register-price'>가격</LabelStyle>
        <InputStyle 
					id='campsite-register-price'
					type="text"
					value={price}
					onChange={validation}
					required
          placeholder='숫자만 입력가능 합니다.'/>
        {warnings.price && <Incorrect>{warnings.price}</Incorrect>}
        </WrapperMyCampsiteInput>

        <WrapperMyCampsiteInput>
        <LabelStyle htmlFor='campsite-register-location'>위치</LabelStyle>

        <InputStyle 
          id = "campsite-register-location"
          type="text"
          value={location}
          onChange={validation}
          placeholder='위치 입력'
        />
        {warnings.location && <Incorrect>{warnings.location}</Incorrect>}
        </WrapperMyCampsiteInput>

        <WrapperMyCampsiteInput>
        <LabelStyle htmlFor='campsite-register-register-link'>예약 링크</LabelStyle>
        <InputStyle 
          id = "campsite-register-register-link"
          type="text"
          value={registerLink}
          onChange={validation}
          placeholder='URL을 입력해주세요'
        />
        {warnings.registerLink && <Incorrect>{warnings.registerLink}</Incorrect>}
        </WrapperMyCampsiteInput>

        <WrapperMyCampsiteInput>
        <LabelStyle>캠핑장 태그 선택</LabelStyle>
        <WrapperLabel>
            {['가족','커플','축제','반려견 동반', '힐링', '아늑함', '활발함', '문화유적', '조용한', '시끌벅적', '깨끗한','익스트림','별보기 좋은','수영장 있는', '계곡이 있는','캠핑카','봄','여름','가을','겨울','주차 편함','바다가 보이는'].map(label => (
                <Label 
                    key={label}
                    onClick={() => handleLabelClick(label)}
                    className={selectedLabels.includes(label) ? 'selected' : ''}
                >
                    {label}
                </Label>
                ))}
        </WrapperLabel>
        {warnings.labels && <Incorrect>{warnings.labels}</Incorrect>}
        </WrapperMyCampsiteInput>

        <Submitbutton onClick={handleSubmitButton} >저장 - 이거 헤더로 올려야함</Submitbutton>

      </WrapperMyCampsiteRegister>
    </>
  )
}
