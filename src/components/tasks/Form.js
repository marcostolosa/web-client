import { Select } from "@chakra-ui/react";
import MarkdownEditor from "components/ui/forms/MarkdownEditor";
import Loading from "components/ui/Loading";
import { useEffect } from 'react';
import useFetch from "../../hooks/useFetch";
import PrimaryButton from "../ui/buttons/Primary";

const TaskForm = ({ isEditForm = false, forTemplate = false, onFormSubmit, task, taskSetter: setTask }) => {

    const [projects] = useFetch('/projects?isTemplate=1');
    const [commands] = useFetch('/commands');

    const onFormChange = ev => {
        const target = ev.target;
        const name = target.name;
        const value = target.value;
        setTask({ ...task, [name]: value });
    };

    useEffect(() => {
        if (projects !== null && projects.length && task.project_id === "") {
            const newProjectId = projects[0].id;
            setTask(prevTask => ({ ...prevTask, project_id: newProjectId }));
        }
    }, [task.project_id, projects, setTask]);

    if (!commands) return <Loading />

    return <form onSubmit={onFormSubmit}>
        <label>
            Project
            <Select name="project_id" onChange={onFormChange}
                value={task.project_id} required>
                {projects && projects.map((project, index) =>
                    <option key={index} value={project.id}>{project.name}</option>
                )}
            </Select>
        </label>
        <label>Summary
            <input type="text" name="summary" onChange={onFormChange} required autoFocus
                value={task.summary} /></label>
        <label>Description
            <MarkdownEditor name="description" onChange={onFormChange} required
                value={task.description} /></label>
        <label>Due date
            <input type="date" name="due_date" onChange={onFormChange} value={task.due_date} /></label>
        <label>Command
            <Select name="command_id" onChange={onFormChange} value={task.command_id}>
                <option value="">(none)</option>
                {commands.map(command =>
                    <option key={`command_${command.id}`} value={command.id}>{command.name}</option>
                )}
            </Select>
        </label>

        <PrimaryButton type="submit">{isEditForm ? "Save" : "Create"}</PrimaryButton>
    </form>
}

export default TaskForm;
