import axios from "axios";
import moment from "moment";
import { AiFillCloseCircle } from "react-icons/ai";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import { SCHEDULES_API, DETAIL_SCHEDULE } from "utils/api/api";
import { showToast } from "utils/showToast";

const EditSchedule = ({
  formData,
  showModal,
  memberOptions,
  modalTitle,
  fetchSchedules,
  setShowModal,
  setModalTitle,
  setFormData,
}) => {
  const toggleModal = () => {
    setShowModal(!showModal);
    setModalTitle("");
    setFormData({
      showDate: "",
      showTime: "",
      isBirthdayShow: false,
      setlist: "",
      memberList: [],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleMemberChange = (e) => {
    const selectedMember = memberOptions.filter(
      (member) => member._id === e.target.value
    );
    setFormData((prevState) => {
      const updatedMemberList = [...prevState.memberList, selectedMember[0]];
      return { ...prevState, memberList: updatedMemberList };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalTitle === "Create Schedule") {
        await axios.post(SCHEDULES_API, formData);
        showToast("success", "Jadwal Theater Created");
      } else if (modalTitle.includes("Edit Schedule")) {
        await axios.put(DETAIL_SCHEDULE(formData._id), formData);
        showToast("info", "Jadwal Theater Updated");
      }
      toggleModal();
      fetchSchedules();
    } catch (error) {
      showToast("error", "Error submitting:", error);
      console.error("Error submitting:", error);
    }
    console.log(formData);
  };

  const handleRemoveMember = (index) => {
    setFormData((prevState) => {
      const updatedMemberList = [...prevState.memberList];
      updatedMemberList.splice(index, 1);
      return { ...prevState, memberList: updatedMemberList };
    });
  };

  const MemberList = () => (
    <FormGroup>
      <Label for="memberList">
        <b>Member List</b>
      </Label>
      <Row>
        {formData.memberList.map((member, index) => (
          <div key={index} className="align-items-center">
            <Col>
              <img width={80} src={member.image} alt={member.name} />
              <div
                style={{
                  backgroundColor: "#FFE8F4",
                  color: "#ff005f",
                  borderRadius: "8px",
                  padding: "5px",
                  height: "40px",
                }}
                className="d-flex align-items-center justify-content-center mt-2 mb-3"
              >
                <p className="text-center mt-3">{member.stage_name}</p>
                <AiFillCloseCircle
                  color="#DC3545"
                  className=" mx-1"
                  onClick={() => handleRemoveMember(index)}
                />
              </div>
            </Col>
          </div>
        ))}
      </Row>
      <p className="mt-3">
        <b>Choose Member</b>
      </p>
      <select
        className="form-control"
        name="member"
        onChange={(e) => handleMemberChange(e)}
      >
        <option value="">Select a member</option>
        {memberOptions?.map((member, idx) => {
          if (
            !formData.memberList.find(
              (selectedMember) => selectedMember._id === member._id
            )
          ) {
            return (
              <option key={idx} value={member._id}>
                {member.name}
              </option>
            );
          }
          return null;
        })}
      </select>
    </FormGroup>
  );

  return (
    <Modal size="md" isOpen={showModal} toggle={toggleModal} centered>
      <Form onSubmit={handleSubmit}>
        <ModalHeader
          style={{
            backgroundColor: "#24a2b7",
            color: "white",
          }}
          toggle={toggleModal}
        >
          {modalTitle}
        </ModalHeader>
        <ModalBody style={{ color: "black" }}>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="showDate">
                  <b>Show Date</b>
                </Label>
                <Input
                  type="date"
                  name="showDate"
                  id="showDate"
                  value={moment(formData.showDate).format("YYYY-MM-DD")}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="showTime">
                  <b>Show Time</b>
                </Label>
                <Input
                  type="time"
                  name="showTime"
                  id="showTime"
                  value={formData.showTime}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="setlist">
                  <b>Setlist</b>
                </Label>
                <Input
                  type="text"
                  name="setlist"
                  id="setlist"
                  value={formData.setlist}
                  onChange={handleChange}
                  placeholder="name setlist"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label>
                  <b>Is Birthday Show</b>
                </Label>
                <Input
                  className="ml-2 mt-2"
                  type="checkbox"
                  name="isBirthdayShow"
                  checked={formData.isBirthdayShow}
                  onChange={handleCheckboxChange}
                />
                <Input
                  type="text"
                  name="birthdayMemberName"
                  id="birthdayMemberName"
                  value={formData.birthdayMemberName}
                  onChange={handleChange}
                  placeholder="Birthday Member"
                  disabled={!formData.isBirthdayShow}
                />
              </FormGroup>
            </Col>
          </Row>
          <MemberList />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit">
            Save
          </Button>{" "}
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default EditSchedule;
